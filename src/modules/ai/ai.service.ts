import { Injectable, OnModuleInit } from '@nestjs/common'
import { pipeline } from '@xenova/transformers'

@Injectable()
export class AiService implements OnModuleInit {
  private extractor: any

  async onModuleInit() {
    // Carrega o modelo de embeddings (all-MiniLM-L6-v2 é leve e eficiente para 384 dimensões)
    this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.extractor) {
      await this.onModuleInit()
    }

    const output = await this.extractor(text, {
      pooling: 'mean',
      normalize: true,
    })

    return Array.from(output.data)
  }
}
