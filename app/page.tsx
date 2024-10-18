import Header from '@/components/Header'
import ImageGenerator from '@/components/ImageGenerator'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">AI Image Generator</h1>
        <ImageGenerator />
      </main>
      <Footer />
    </div>
  )
}