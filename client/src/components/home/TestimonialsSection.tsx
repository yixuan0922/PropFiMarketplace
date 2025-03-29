import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Home, TrendingUp } from 'lucide-react';
import { testimonials } from '@/lib/mockData';

const TestimonialsSection = () => {
  return (
    <div className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">Success Stories</h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
            See how PropFi has helped people achieve their real estate goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white shadow-sm border border-neutral-200">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <div className="mr-4">
                    <Avatar className="h-12 w-12 bg-primary-100 text-primary-600">
                      <AvatarFallback>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">{testimonial.name}, {testimonial.age}</h3>
                    <p className="text-neutral-600">{testimonial.profession}</p>
                  </div>
                </div>
                <blockquote className="text-neutral-700 mb-4">
                  "{testimonial.testimonial}"
                </blockquote>
                <div className="flex items-center text-green-500">
                  {testimonial.achievement.includes('own') ? (
                    <Home className="mr-2 h-4 w-4" />
                  ) : (
                    <TrendingUp className="mr-2 h-4 w-4" />
                  )}
                  <span className="font-medium">{testimonial.achievement}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
