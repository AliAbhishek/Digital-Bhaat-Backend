import { Textract } from 'aws-sdk';
import { deleteFromS3 } from './s3.service';

const textract = new Textract();

export const extractTextFromS3 = async (bucket: string, key: string) => {
  const params = {
    Document: {
      S3Object: { Bucket: bucket, Name: key },
    },
    FeatureTypes: ['FORMS'],
  };

  const response = await textract.analyzeDocument(params).promise();
  const blocks = response.Blocks || [];

  const blockMap = new Map<string, any>();
  for (const block of blocks) {
    blockMap.set(block.Id, block);
  }

  const keyValues: { [key: string]: string } = {};

  for (const block of blocks) {
    if (block.BlockType === 'KEY_VALUE_SET' && block.EntityTypes?.includes('KEY')) {
      const keyText = getTextForBlock(block, blockMap);
      const valueBlockId = block.Relationships?.find((r) => r.Type === 'VALUE')?.Ids?.[0];
      if (valueBlockId) {
        const valueBlock = blockMap.get(valueBlockId);
        const valueText = getTextForBlock(valueBlock, blockMap);
        keyValues[keyText] = valueText;
      }
    }
  }

  console.log("Textract FORMS output:", keyValues);

  // Normalize
  let normalized = normalizeAadharData(keyValues);

  // Fallback: if UID or Name missing, try OCR full text
  if (!normalized.aadhar || !normalized.name) {
    const ocrText = await getFullOCRText(bucket, key);
    normalized = {
      ...normalized,
      ...extractFromPlainText(ocrText, normalized),
    };
  }

  await deleteFromS3(bucket, key);
  return normalized;
};

// 🔄 Text from child blocks
function getTextForBlock(block: any, blockMap: Map<string, any>) {
  let text = '';
  const childIds = block.Relationships?.find((r) => r.Type === 'CHILD')?.Ids || [];
  for (const id of childIds) {
    const wordBlock = blockMap.get(id);
    if (wordBlock?.BlockType === 'WORD') {
      text += `${wordBlock.Text} `;
    }
  }
  return text.trim();
}

// 🔄 Normalize structured key-value data
function normalizeAadharData(rawData: { [key: string]: string }) {
  const normalized: { [key: string]: string } = {};

  for (const [rawKey, value] of Object.entries(rawData)) {
    const key = rawKey.toLowerCase().replace(/[^a-z]/gi, '');
    const digits = value.replace(/\D/g, '');

    if (key.includes('dob') || value.match(/\d{2}[/-]\d{2}[/-]\d{4}/)) {
      normalized.dob = value;
    }

    if (digits.length === 12 && !key.includes('vid') && !key.includes('virtual')) {
      normalized.aadhar = digits;
    }

    if (value.toLowerCase().includes('male')) {
      normalized.gender = 'MALE';
    } else if (value.toLowerCase().includes('female')) {
      normalized.gender = 'FEMALE';
    }

    if (!normalized.name && key.includes('name')) {
      normalized.name = value;
    }
  }

  return normalized;
}

// 🧠 Fallback OCR extraction
async function getFullOCRText(bucket: string, key: string) {
  const res = await textract.detectDocumentText({
    Document: {
      S3Object: { Bucket: bucket, Name: key },
    },
  }).promise();

  return res.Blocks?.filter((b) => b.BlockType === 'LINE').map((b) => b.Text).join('\n') || '';
}

// ✨ Extract UID + Name from plain OCR text
function extractFromPlainText(text: string, existing: any) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const extracted: { [key: string]: string } = {};

  let probableName = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 🔍 Aadhar number (must be 12 digits, ignore VID)
    if (!existing.aadhar && line.replace(/\D/g, '').length === 12 && !line.toLowerCase().includes('vid')) {
      extracted.aadhar = line.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    // 🔍 DOB fallback
    if (!existing.dob && /\d{2}[/-]\d{2}[/-]\d{4}/.test(line)) {
      extracted.dob = line.match(/\d{2}[/-]\d{2}[/-]\d{4}/)?.[0]!;
    }

    // 🔍 Gender fallback
    if (!existing.gender && /male|female/i.test(line)) {
      extracted.gender = /male/i.test(line) ? 'MALE' : 'FEMALE';
    }

    // 🔍 Name (uppercase line with no digits, not containing GOVERNMENT etc)
    if (
      !existing.name &&
      /^[A-Z\s]+$/.test(line) &&
      !line.includes('GOVERNMENT') &&
      !/\d/.test(line) &&
      line.length >= 6 &&
      line.length <= 30
    ) {
      probableName = line;
    }
  }

  if (probableName && !existing.name) {
    extracted.name = probableName;
  }

  return extracted;
}

