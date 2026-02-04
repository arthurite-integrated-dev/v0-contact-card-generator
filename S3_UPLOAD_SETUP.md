# S3 Image Upload Setup

## Overview
Staff members can now upload images directly from the Admin Panel. Images are automatically uploaded to AWS S3 and the URL is populated in the `photo_url` field.

## Prerequisites

1. **AWS Account** with S3 bucket created
2. **AWS Credentials** with S3 access permissions
3. **Environment Variables** configured

## Environment Variables

Add the following to your `.env.local` file:

```bash
# AWS Configuration
REGION=us-east-1
ACCESS_KEY_ID=your_aws_access_key_id
SECRET_ACCESS_KEY=your_aws_secret_access_key
S3_BUCKET_NAME=your-s3-bucket-name
```

## AWS S3 Bucket Setup

### 1. Create an S3 Bucket
```bash
aws s3 mb s3://your-bucket-name
```

### 2. Set Bucket Policy (to allow public read access)
Replace `your-bucket-name` with your actual bucket name:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### 3. Configure CORS (if needed for cross-origin requests)
```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

## How It Works

1. **Upload**: Staff selects an image file in the Admin Panel
2. **Validation**: File is validated (image type, max 5MB size)
3. **Preview**: Image preview is shown immediately
4. **S3 Upload**: File is uploaded to S3 via `/api/upload` endpoint
5. **Auto-populate**: The S3 URL is automatically set as `photo_url`
6. **Save**: When the contact is created, the photo URL is saved to DynamoDB

## File Upload Endpoint

**Endpoint**: `POST /api/upload`

**Request**: FormData with `file` field

**Response**:
```json
{
  "url": "https://your-bucket-name.s3.amazonaws.com/contacts/timestamp-filename.jpg"
}
```

**Validation**:
- File must be an image (image/* MIME type)
- File size must be less than 5MB
- Files are stored in `/contacts` directory with timestamp prefix

## AWS IAM Permissions

Ensure your AWS credentials have these S3 permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## Testing

1. Start the development server: `npm run dev`
2. Navigate to the Admin Panel
3. Fill in contact details
4. Click on the photo upload area
5. Select an image file (PNG, JPG, etc.)
6. Verify the preview appears
7. Submit the form
8. Confirm the contact is created with the photo URL

## Troubleshooting

### "No file provided" Error
- Ensure a file is selected before uploading

### "File must be an image" Error
- Only image files (PNG, JPG, GIF, etc.) are supported

### "File size must be less than 5MB" Error
- Reduce the image file size and try again

### "Failed to upload file" Error
- Check AWS credentials in `.env.local`
- Verify S3 bucket exists
- Ensure bucket policy allows PutObject action
- Check CloudWatch logs for detailed error messages

### CORS Issues
- Configure bucket CORS policy (see AWS S3 Bucket Setup)
- Ensure domain is added to AllowedOrigins

## Cost Considerations

- **Storage**: Pay per GB stored in S3
- **PUT requests**: First 1GB per month free with S3 Standard storage class
- **Data transfer**: Outbound data transfer charges apply
- Consider setting up S3 lifecycle policies to delete old images if needed
