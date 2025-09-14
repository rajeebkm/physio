import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: "Services",
      links: [
        "Online Consultations",
        "Home Physiotherapy",
        "Specialist Care",
        "Emergency Services",
        "Health Checkups"
      ]
    },
    {
      title: "Company",
      links: [
        "About Us",
        "Our Team",
        "Careers",
        "Press",
        "Contact"
      ]
    },
    {
      title: "Support",
      links: [
        "Help Center",
        "Privacy Policy",
        "Terms of Service",
        "Cookie Policy",
        "Accessibility"
      ]
    },
    {
      title: "Resources",
      links: [
        "Health Blog",
        "Patient Stories",
        "Medical Guidelines",
        "Insurance Partners",
        "Download App"
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">P</span>
                </div>
                <h3 className="text-2xl font-bold text-gradient-primary">PhysioCare</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
                Transforming healthcare delivery across India with innovative technology and 
                compassionate care. Your health journey starts here.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-muted-foreground">
                  <Phone className="w-4 h-4 mr-3 text-primary" />
                  <span>1800-123-4567 (24/7)</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="w-4 h-4 mr-3 text-primary" />
                  <span>support@physiocare.com</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-3 text-primary" />
                  <span>Mumbai, Delhi, Bangalore & 47 more cities</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-card-foreground mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href="#" 
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="py-8 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="font-semibold text-card-foreground mb-2">Stay Updated</h4>
              <p className="text-muted-foreground">Get health tips and updates delivered to your inbox</p>
            </div>
            <div className="flex w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-64 px-4 py-3 border border-border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="bg-gradient-primary text-primary-foreground px-6 py-3 rounded-r-lg font-medium hover:shadow-glow transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              © 2024 PhysioCare. All rights reserved. | Licensed Healthcare Provider
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
              ISO 27001 Certified
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
              HIPAA Compliant
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
              Ministry of Health Approved
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
              Data Protection Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;