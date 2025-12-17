import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Feature Voting</h1>
      <p className="text-xl text-gray-600 mb-8">
        Submit and vote on features you want to see built. Help shape the future of our product.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/features">
          <Button size="lg">Browse Features</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline" size="lg">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
