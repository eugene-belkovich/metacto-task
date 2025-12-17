import { FeatureDetail } from '@/components/views/feature-detail';

interface FeaturePageProps {
  params: Promise<{ id: string }>;
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <FeatureDetail featureId={id} />
    </div>
  );
}
