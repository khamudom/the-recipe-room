# AI Recipe Analysis Integration Guide

This guide explains how to integrate real AI services for recipe analysis in the Recipe Room application.

## Current Implementation

The current implementation uses a mock AI service that simulates recipe analysis. This provides a realistic user experience while you integrate with actual AI services.

## Available AI Services

### 1. OpenAI GPT-4 Vision API

**Pros:**

- Excellent text extraction from images
- Can understand complex recipe formats
- Handles handwritten and printed text well
- Structured output capabilities

**Cons:**

- Higher cost per request
- Rate limits apply

**Integration Example:**

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeRecipeWithOpenAI(imageData: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract recipe information from this image. Return a JSON object with: title, description, ingredients (array), instructions (array), prepTime, cookTime, servings (number), category. Ensure ingredients and instructions are properly formatted.",
          },
          {
            type: "image_url",
            image_url: {
              url: imageData,
            },
          },
        ],
      },
    ],
    max_tokens: 1000,
  });

  return JSON.parse(response.choices[0].message.content);
}
```

### 2. Google Cloud Vision API + Natural Language API

**Pros:**

- Excellent OCR capabilities
- Good for text-heavy recipes
- Cost-effective for high volume

**Cons:**

- Requires additional processing for recipe structure
- May need custom parsing logic

**Integration Example:**

```typescript
import { ImageAnnotatorClient } from "@google-cloud/vision";

const client = new ImageAnnotatorClient();

export async function analyzeRecipeWithGoogleVision(imageData: string) {
  // Extract text from image
  const [result] = await client.textDetection(imageData);
  const text = result.fullTextAnnotation?.text || "";

  // Use Natural Language API or custom parsing to extract recipe structure
  // This would require additional processing to identify ingredients vs instructions
  return parseRecipeText(text);
}
```

### 3. Azure Computer Vision

**Pros:**

- Good OCR capabilities
- Built-in text recognition
- Azure ecosystem integration

**Cons:**

- May require custom parsing for recipe structure

### 4. AWS Rekognition + Textract

**Pros:**

- Excellent for document analysis
- Good for structured text extraction
- AWS ecosystem integration

**Cons:**

- More complex setup
- Higher cost for small scale

## Implementation Steps

### 1. Choose Your AI Service

Based on your requirements:

- **Budget-conscious**: Google Cloud Vision API
- **Best accuracy**: OpenAI GPT-4 Vision API
- **AWS ecosystem**: AWS Textract
- **Azure ecosystem**: Azure Computer Vision

### 2. Update the API Endpoint

Replace the mock implementation in `/app/api/analyze-recipe/route.ts` with your chosen AI service.

### 3. Environment Variables

Add your API keys to `.env.local`:

```env
# For OpenAI
OPENAI_API_KEY=your_openai_api_key

# For Google Cloud
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account.json

# For Azure
AZURE_COMPUTER_VISION_KEY=your_azure_key
AZURE_COMPUTER_VISION_ENDPOINT=your_azure_endpoint

# For AWS
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
```

### 4. Install Dependencies

```bash
# For OpenAI
npm install openai

# For Google Cloud
npm install @google-cloud/vision

# For Azure
npm install @azure/cognitiveservices-computervision

# For AWS
npm install @aws-sdk/client-textract
```

### 5. Error Handling

Implement proper error handling for:

- API rate limits
- Invalid images
- Network timeouts
- Malformed responses

### 6. Testing

Test with various recipe formats:

- Handwritten recipes
- Printed cookbook pages
- Screenshots from websites
- Photos of recipe cards

## Cost Considerations

### OpenAI GPT-4 Vision API

- ~$0.01-0.03 per image (depending on size)
- Good for low to medium volume

### Google Cloud Vision API

- ~$0.0015 per 1000 characters
- More cost-effective for high volume

### Azure Computer Vision

- ~$1.50 per 1000 transactions
- Competitive pricing

### AWS Textract

- ~$1.50 per 1000 pages
- Good for document-heavy workflows

## Security Considerations

1. **API Key Management**: Store API keys securely in environment variables
2. **Image Validation**: Validate image size and format before processing
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Data Privacy**: Ensure user images are not stored permanently
5. **Content Filtering**: Filter inappropriate content before processing

## Performance Optimization

1. **Image Compression**: Compress images before sending to AI services
2. **Caching**: Cache similar recipe analyses
3. **Async Processing**: Use background jobs for long-running analyses
4. **CDN**: Use CDN for faster image uploads

## Monitoring and Analytics

Track these metrics:

- Analysis success rate
- Processing time
- Cost per analysis
- User satisfaction
- Error rates by image type

## Future Enhancements

1. **Multi-language Support**: Add support for recipes in different languages
2. **Nutritional Analysis**: Extract nutritional information
3. **Allergen Detection**: Identify common allergens in ingredients
4. **Recipe Validation**: Validate recipe completeness and accuracy
5. **Batch Processing**: Process multiple recipes at once

## Support

For issues with AI integration:

1. Check the AI service documentation
2. Review error logs
3. Test with simple, clear images first
4. Consider fallback to manual entry for failed analyses
