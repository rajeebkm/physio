import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Phone } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute top-1/2 right-0 w-60 h-60 bg-white rounded-full translate-x-30 -translate-y-30"></div>
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white rounded-full translate-y-16"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 fade-up">
          Ready to Transform Your Healthcare Experience?
        </h2>
        <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed fade-up-delay-1">
          Join thousands of patients and healthcare professionals who are already
          experiencing the future of healthcare. Start your journey to better health today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 fade-up-delay-2">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Download className="mr-2 h-5 w-5" />
            Download App
          </Button>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-blue-100 fade-up-delay-3">
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            <span>Emergency: 1800-123-4567</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-blue-200/50"></div>
          <div>
            <span>Available 24/7 for urgent care</span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-blue-200/30 fade-up-delay-3">
          <div className="flex flex-wrap justify-center items-center gap-8 text-blue-100 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>Licensed Professionals</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;