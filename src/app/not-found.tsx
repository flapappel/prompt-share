import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold">Pagina niet gevonden</h2>
      <p className="text-gray-600">
        De pagina die je zoekt bestaat niet of is verplaatst.
      </p>
      <Link href="/">
        <Button variant="outline">
          Terug naar home
        </Button>
      </Link>
    </div>
  )
} 