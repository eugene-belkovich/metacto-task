import { FeatureList } from '@/components/views/feature-list';

export default function FeaturesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Features</h1>
      <FeatureList />
    </div>
  );
}
