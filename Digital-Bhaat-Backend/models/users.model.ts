import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'user' | 'donor';

export interface IUser extends Document {
    countryCode: number;
    phoneNumber: number;
    role: UserRole;
    otp: number | undefined;
    otpExpiresIn: Date | undefined;
    isPhoneNumberVerified: Boolean;
    profileImage?: string;
    fullName: string;
    email: string;
    address: {
        street: string;
        village: string;
        city: string;
        district: string;
        state: string;
        pinCode: number;
        country: string;
    };
    consentGiven: boolean;
    isAnonymousDonation: boolean;
    isProfileCompleted: boolean;
    isDeleteByAdmin:boolean
}

const UserSchema: Schema = new Schema<IUser>(
    {
        countryCode: {
            type: Number,
            required: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ['user', 'donor'],
            required: true,
        },
        otp: {
            type: Number,

        },
        otpExpiresIn: {
            type: Date,

        },
        isPhoneNumberVerified: {
            type: Boolean,
            default: false
        },
        profileImage: {
            type: String,
            default: '',
        },
        fullName: {
            type: String,

        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        address: {
            street: {
                type: String,

            },
            village: {
                type: String,
            },
            city: {
                type: String,
            },
            district: {
                type: String,
            },
            state: {
                type: String,
            },
            pinCode: {
                type: Number,
            },
            country: {
                type: String,
            },
        },
        consentGiven: {
            type: Boolean,
        },
        isAnonymousDonation: {
            type: Boolean,
        },
        isProfileCompleted: {
            type: Boolean,
            default: false

        },
        isDeleteByAdmin:{type:Boolean,default:false}
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUser>('User', UserSchema);
