// import { Textract } from 'aws-sdk';
// import { deleteFromS3 } from './s3.service';

// const textract = new Textract();

// export const extractTextFromS3 = async (bucket: string, key: string) => {
//   const params = {
//     Document: {
//       S3Object: { Bucket: bucket, Name: key },
//     },
//     FeatureTypes: ['FORMS'],
//   };

//   const response = await textract.analyzeDocument(params).promise();
//   const blocks = response.Blocks || [];

//   const blockMap = new Map<string, any>();
//   for (const block of blocks) {
//     blockMap.set(block.Id, block);
//   }

//   const keyValues: { [key: string]: string } = {};

//   for (const block of blocks) {
//     if (block.BlockType === 'KEY_VALUE_SET' && block.EntityTypes?.includes('KEY')) {
//       const keyText = getTextForBlock(block, blockMap);
//       const valueBlockId = block.Relationships?.find((r) => r.Type === 'VALUE')?.Ids?.[0];
//       if (valueBlockId) {
//         const valueBlock = blockMap.get(valueBlockId);
//         const valueText = getTextForBlock(valueBlock, blockMap);
//         keyValues[keyText] = valueText;
//       }
//     }
//   }

//   console.log("Textract FORMS output:", keyValues);

//   // Normalize
//   let normalized = normalizeAadharData(keyValues);

//   // Fallback: if UID or Name missing, try OCR full text
//   if (!normalized.aadhar || !normalized.name) {
//     const ocrText = await getFullOCRText(bucket, key);
//     normalized = {
//       ...normalized,
//       ...extractFromPlainText(ocrText, normalized),
//     };
//   }

//   await deleteFromS3(bucket, key);
//   return normalized;
// };

// // 🔄 Text from child blocks
// function getTextForBlock(block: any, blockMap: Map<string, any>) {
//   let text = '';
//   const childIds = block.Relationships?.find((r) => r.Type === 'CHILD')?.Ids || [];
//   for (const id of childIds) {
//     const wordBlock = blockMap.get(id);
//     if (wordBlock?.BlockType === 'WORD') {
//       text += `${wordBlock.Text} `;
//     }
//   }
//   return text.trim();
// }

// // 🔄 Normalize structured key-value data
// function normalizeAadharData(rawData: { [key: string]: string }) {
//   const normalized: { [key: string]: string } = {};

//   for (const [rawKey, value] of Object.entries(rawData)) {
//     const key = rawKey.toLowerCase().replace(/[^a-z]/gi, '');
//     const digits = value.replace(/\D/g, '');

//     if (key.includes('dob') || value.match(/\d{2}[/-]\d{2}[/-]\d{4}/)) {
//       normalized.dob = value;
//     }

//     if (digits.length === 12 && !key.includes('vid') && !key.includes('virtual')) {
//       normalized.aadhar = digits;
//     }

//     if (value.toLowerCase().includes('male')) {
//       normalized.gender = 'MALE';
//     } else if (value.toLowerCase().includes('female')) {
//       normalized.gender = 'FEMALE';
//     }

//     if (!normalized.name && key.includes('name')) {
//       normalized.name = value;
//     }
//   }

//   return normalized;
// }

// // 🧠 Fallback OCR extraction
// async function getFullOCRText(bucket: string, key: string) {
//   const res = await textract.detectDocumentText({
//     Document: {
//       S3Object: { Bucket: bucket, Name: key },
//     },
//   }).promise();

//   return res.Blocks?.filter((b) => b.BlockType === 'LINE').map((b) => b.Text).join('\n') || '';
// }

// // ✨ Extract UID + Name from plain OCR text
// function extractFromPlainText(text: string, existing: any) {
//   const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
//   const extracted: { [key: string]: string } = {};

//   let probableName = '';

//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i];

//     // 🔍 Aadhar number (must be 12 digits, ignore VID)
//     if (!existing.aadhar && line.replace(/\D/g, '').length === 12 && !line.toLowerCase().includes('vid')) {
//       extracted.aadhar = line.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
//     }

//     // 🔍 DOB fallback
//     if (!existing.dob && /\d{2}[/-]\d{2}[/-]\d{4}/.test(line)) {
//       extracted.dob = line.match(/\d{2}[/-]\d{2}[/-]\d{4}/)?.[0]!;
//     }

//     // 🔍 Gender fallback
//     if (!existing.gender && /male|female/i.test(line)) {
//       extracted.gender = /male/i.test(line) ? 'MALE' : 'FEMALE';
//     }

//     // 🔍 Name (uppercase line with no digits, not containing GOVERNMENT etc)
//     if (
//       !existing.name &&
//       /^[A-Z\s]+$/.test(line) &&
//       !line.includes('GOVERNMENT') &&
//       !/\d/.test(line) &&
//       line.length >= 6 &&
//       line.length <= 30
//     ) {
//       probableName = line;
//     }
//   }

//   if (probableName && !existing.name) {
//     extracted.name = probableName;
//   }

//   return extracted;
// }

import { Textract } from 'aws-sdk';
import { deleteFromS3 } from './s3.service';

const textract = new Textract();

// 🔍 Main function to extract data from Family ID image in S3
export const extractTextFromS3 = async (bucket: string, key: string) => {
  const params = {
    Document: {
      S3Object: { Bucket: bucket, Name: key },
    },
    FeatureTypes: ['TABLES', 'FORMS'],
  };

  const response = await textract.analyzeDocument(params).promise();
  const blocks = response.Blocks || [];


  let members = extractTableData(blocks);
  

// Fallback if no members found
if (members.length === 0) {
  const ocrText = await getFullOCRText(bucket, key);
  members = fallbackMemberExtraction(ocrText);
}
  const blockMap = new Map(blocks.map((b) => [b.Id, b]));

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

  let normalized = normalizeFamilyIdData(keyValues);

  if (!normalized.annualIncome || !normalized.name) {
    const ocrText = await getFullOCRText(bucket, key);
    normalized = {
      ...normalized,
      ...extractFromPlainText(ocrText, normalized),
    };
  }

  await deleteFromS3(bucket, key);
  return {
    ...normalized,
    members,
  };
};

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

function normalizeFamilyIdData(rawData: { [key: string]: string }) {
  const normalized: any = {};
  
  for (const [rawKey, value] of Object.entries(rawData)) {
    const key = rawKey.toLowerCase()
      .replace(/[\u0900-\u097F]/g, '') // Remove Devanagari chars
      .replace(/\W/g, ''); // Remove non-alphanumeric

    if (key.includes('annualincome')) normalized.annualIncome = value;
    if (key.includes('name') && !normalized.name) normalized.name = value;
    if (key.includes('dob') || /\d{2}[\/-]\d{2}[\/-]\d{4}/.test(value)) {
      normalized.dob = value.match(/\d{2}[\/-]\d{2}[\/-]\d{4}/)?.[0];
    }
    // Add Hindi support for occupation
    if (key.includes('occupation') || key.includes('व्यवसाय')) {
      normalized.occupation = value;
    }
  }

  return normalized;
}

async function getFullOCRText(bucket: string, key: string) {
  const res = await textract.detectDocumentText({
    Document: { S3Object: { Bucket: bucket, Name: key } },
  }).promise();

  return res.Blocks?.filter((b) => b.BlockType === 'LINE').map((b) => b.Text).join('\n') || '';
}

function extractFromPlainText(text: string, existing: any) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const extracted: { [key: string]: string } = {};

  for (const line of lines) {
    if (!existing.annualIncome && /income/i.test(line)) {
      const match = line.match(/\d{4,6}/);
      if (match) extracted.annualIncome = match[0];
    }
    if (!existing.name && /^[A-Z\s]+$/.test(line) && !/\d/.test(line) && line.length >= 6) {
      extracted.name = line;
    }
    if (!existing.dob && /\d{2}[/-]\d{2}[/-]\d{4}/.test(line)) {
      extracted.dob = line.match(/\d{2}[/-]\d{2}[/-]\d{4}/)?.[0]!;
    }
    if (!existing.occupation && /student|labour|housewife|employed|unemployed/i.test(line)) {
      extracted.occupation = line;
    }
  }

  return extracted;
}

function extractTableData(blocks: Textract.BlockList | undefined) {
  if (!Array.isArray(blocks)) return [];

  const blockMap = new Map(blocks.map(b => [b.Id, b]));
  const tables = blocks.filter(b => b.BlockType === 'TABLE');
  const members: any[] = [];

  // Identify the members table by header keywords
  for (const table of tables) {
    const cells = blocks.filter(b => 
      b.BlockType === 'CELL' && b.ParentId === table.Id
    ).sort((a, b) => 
      (a.RowIndex! - b.RowIndex!) || (a.ColumnIndex! - b.ColumnIndex!)
    );

    if (cells.length === 0) continue;

    // Find header row
    const headerRow = cells.filter(cell => cell.RowIndex === 1);
    const headerTexts = headerRow.map(cell => getCellText(cell, blockMap).toLowerCase());

    // Check if this is the members table
    const isMemberTable = [
      'name', 'relation', 'dob', 'income', 'occupation', 'divyang'
    ].some(keyword => headerTexts.some(t => t.includes(keyword)));

    if (!isMemberTable) continue;

    // Extract member data
    const maxRow = Math.max(...cells.map(c => c.RowIndex!));
    for (let rowIndex = 2; rowIndex <= maxRow; rowIndex++) {
      const rowCells = cells.filter(c => c.RowIndex === rowIndex);
      if (rowCells.length === 0) continue;

      const member: any = {};
      for (const cell of rowCells) {
        const header = headerTexts[cell.ColumnIndex! - 1] || '';
        const text = getCellText(cell, blockMap);

        if (header.includes('name')) member.name = text;
        if (header.includes('relation')) member.relation = text;
        if (header.includes('dob')) member.dob = text;
        if (header.includes('income')) member.income = text;
        if (header.includes('occupation')) member.occupation = text;
        if (header.includes('divyang')) {
          member.isDivyang = /yes|y|हाँ|1/i.test(text);
        }
      }

      // Only add if we have at least name and relation
      if (member.name && member.relation) {
        members.push(member);
      }
    }
  }

  return members;
}

function getCellText(cell: Textract.Block, blockMap: Map<string, Textract.Block>) {
  return (cell.Relationships || [])
    .flatMap(r =>
      r.Type === 'CHILD' ? (r.Ids || []).map(id => blockMap.get(id)) : []
    )
    .filter(b => b?.BlockType === 'WORD')
    .map(b => b!.Text!)
    .join(' ')
    .trim();
}


function fallbackMemberExtraction(text: string) {
  const members = [];
  const regex = /(\d+\.\s*)?([A-Z\s]+)\s*(पिता|माता|पुत्र|पुत्री|भाई|बहन)\s*(\d{2}[\/-]\d{2}[\/-]\d{4})?/gi;
  
  let match;
  while ((match = regex.exec(text)) !== null) {
    const [, , name, relation, dob] = match;
    if (name && relation) {
      members.push({
        name: name.trim(),
        relation: relation.trim(),
        dob: dob || ''
      });
    }
  }
  return members;
}

