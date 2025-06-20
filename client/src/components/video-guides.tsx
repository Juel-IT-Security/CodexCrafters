import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Github } from "lucide-react";
import type { Guide } from "@shared/schema";

export default function VideoGuides() {
  const { data: guides, isLoading } = useQuery<Guide[]>({
    queryKey: ["/api/guides"],
  });

  if (isLoading) {
    return (
      <section id="guides" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="guides" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Video Guides</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn through comprehensive video tutorials covering AI development tools, best practices, and real-world examples
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides?.map((guide) => (
            <Card key={guide.id} className="shadow-lg overflow-hidden border border-gray-200">
              {/* Placeholder for future video content */}
              <div className={`aspect-video bg-gradient-to-br ${guide.thumbnailColor} flex items-center justify-center`}>
                <div className="text-center text-white">
                  <Play className="w-12 h-12 mb-2 mx-auto" />
                  <p className="text-sm">Coming Soon</p>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{guide.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action for Video Suggestions */}
        <div className="mt-16 text-center">
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Suggest a Video Topic</h3>
              <p className="text-gray-600 mb-6">
                Have a specific topic you'd like us to cover? Let us know what you want to learn about!
              </p>
              <Button asChild className="bg-brand-600 hover:bg-brand-700">
                <a
                  href="https://github.com/Juel-IT-Security/CodexCrafters/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Suggest on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
