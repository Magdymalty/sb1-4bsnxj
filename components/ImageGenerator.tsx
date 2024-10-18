"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const FAL_KEY = process.env.NEXT_PUBLIC_FAL_KEY

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fal, setFal] = useState(null)

  useEffect(() => {
    console.log("FAL_KEY:", process.env.NEXT_PUBLIC_FAL_KEY);
    import('@fal-ai/client').then((module) => {
      console.log("FAL module loaded:", module);
      setFal(module.fal)
      if (FAL_KEY) {
        module.fal.config({ credentials: FAL_KEY })
      }
    }).catch(err => console.error("Error loading FAL module:", err));
  }, [])

  const generateImage = async () => {
    if (!FAL_KEY) {
      setError('FAL_KEY is not set. Please check your environment variables.')
      return
    }

    if (!fal) {
      setError('FAL client is not initialized. Please try again.')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      console.log("Generating image with prompt:", prompt);
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt: prompt,
        },
        logs: true,
        onQueueUpdate: (update) => {
          console.log("Queue update:", update);
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      })
      console.log("Generation result:", result);
      if (result.data && result.data.images && result.data.images[0]) {
        setImageUrl(result.data.images[0].url)
      } else {
        throw new Error("Unexpected result structure");
      }
    } catch (err) {
      console.error('Error generating image:', err)
      setError(`Failed to generate image: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter your image description"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={generateImage} disabled={isLoading || !prompt || !fal}>
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Generated image" className="max-w-full h-auto rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  )
}