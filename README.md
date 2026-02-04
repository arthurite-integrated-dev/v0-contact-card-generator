# Arthurite Contact Card Generator - DynamoDB Version

A professional digital contact card generator built with Next.js and AWS DynamoDB.

## 🚀 What's New

This project has been **migrated from Supabase to AWS DynamoDB** for better scalability and AWS ecosystem integration.

## 📋 Quick Start

1. **Set up AWS DynamoDB**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit .env.local with your AWS credentials
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create DynamoDB table**
   ```bash
   npm run setup-dynamodb
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

## 📚 Documentation

- **[Setup Guide](./SETUP-DYNAMODB.md)** - Complete setup instructions
- **[Migration Guide](./MIGRATION.md)** - Migrate from Supabase to DynamoDB
- **[Original Setup](./SETUP.md)** - Legacy Supabase instructions (deprecated)

## 🏗️ Architecture

- **Frontend**: Next.js 16 + React 19
- **Database**: AWS DynamoDB
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **QR Codes**: qrcode library

## 🔧 Key Features

- ✅ Professional contact cards with QR codes
- ✅ Admin dashboard for managing contacts
- ✅ Unique shareable URLs for each contact
- ✅ Responsive design
- ✅ AWS DynamoDB for scalable data storage
- ✅ Easy deployment to Vercel or AWS

## 🔄 Migration from Supabase

If you're upgrading from the previous Supabase version, see [MIGRATION.md](./MIGRATION.md) for step-by-step instructions.

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add AWS environment variables
4. Deploy!

### AWS Lambda
Use frameworks like Serverless or AWS CDK for serverless deployment.

## 💰 Cost Considerations

- DynamoDB Free Tier: 25GB storage + 25 read/write capacity units
- Perfect for small to medium applications
- Scales automatically with your needs

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Set up DynamoDB table
npm run setup-dynamodb
```

## 📝 Environment Variables

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
DYNAMODB_TABLE_NAME=contacts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.