import { Card, CardContent } from './../components/ui/card';
import { Badge } from './../components/ui/badge';
import { Button } from './../components/ui/button';
import { 
  Award, 
  Users, 
  Truck, 
  Shield, 
  Heart, 
  Target,
  CheckCircle,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { number: '50,000+', label: 'Happy Customers', icon: Users },
    { number: '15+', label: 'Years Experience', icon: Award },
    { number: '99.9%', label: 'Uptime Guarantee', icon: Shield },
    { number: '24/7', label: 'Customer Support', icon: Heart },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide high-quality laptops and technology solutions that empower people to achieve their goals, whether for work, gaming, or creativity.'
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'Customer satisfaction, quality products, fair pricing, and exceptional service are at the core of everything we do.'
    },
    {
      icon: Star,
      title: 'Our Vision',
      description: 'To be the most trusted and reliable laptop retailer, known for our expertise, service, and commitment to customer success.'
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: 'Quality Guarantee',
      description: 'Every product is thoroughly tested and comes with full manufacturer warranty.'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Free 2-day shipping on orders over 20000 DA, with express options available.'
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Your personal and payment information is always protected with SSL encryption.'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Our technical support team is here to help with any questions or issues.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: '/placeholder.svg',
      description: '15+ years in tech retail, passionate about bringing cutting-edge technology to everyone.'
    },
    {
      name: 'Mike Chen',
      role: 'Technical Director',
      image: '/placeholder.svg',
      description: 'Former software engineer with deep expertise in laptop hardware and performance optimization.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Success Manager',
      image: '/placeholder.svg',
      description: 'Dedicated to ensuring every customer has an exceptional experience with our products and service.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-cta text-cta-foreground mb-4">About LaptopStore</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Trusted Technology Partner
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            For over 15 years, we've been helping customers find the perfect laptops, 
            accessories, and parts to power their digital lives. From students to 
            professionals to gamers, we have the expertise and products you need.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <section className="py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-secondary text-secondary-foreground mb-4">Our Story</Badge>
              <h2 className="text-3xl font-bold mb-6">
                Building Trust Through Technology
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2008, LaptopStore began as a small family business with a simple mission: 
                  to help people find the right technology for their needs. What started as a single 
                  storefront has grown into a trusted online retailer serving customers nationwide.
                </p>
                <p>
                  We've witnessed the incredible evolution of laptop technology over the years, 
                  from bulky machines to sleek ultrabooks and powerful gaming rigs. Through it all, 
                  our commitment to quality, service, and fair pricing has remained constant.
                </p>
                <p>
                  Today, we're proud to offer one of the largest selections of laptops and accessories 
                  online, backed by expert support and industry-leading warranties. Our team of 
                  technology enthusiasts is passionate about helping you find solutions that fit 
                  your lifestyle and budget.
                </p>
              </div>
              <div className="mt-6">
                <Link to="/contact-us">
                  <Button size="lg">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Card className="bg-primary/5">
                  <CardContent className="p-6 text-center">
                    <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">Industry Awards</div>
                    <div className="text-sm text-muted-foreground">Best Online Retailer 2023</div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/20">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <div className="font-semibold">Customer Focus</div>
                    <div className="text-sm text-muted-foreground">4.9/5 Average Rating</div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4 mt-8">
                <Card className="bg-cta/20">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-8 w-8 text-cta mx-auto mb-2" />
                    <div className="font-semibold">Security First</div>
                    <div className="text-sm text-muted-foreground">SSL Encrypted</div>
                  </CardContent>
                </Card>
                <Card className="bg-accent">
                  <CardContent className="p-6 text-center">
                    <Truck className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
                    <div className="font-semibold">Fast Delivery</div>
                    <div className="text-sm text-muted-foreground">2-Day Shipping</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Drives Us</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our core values guide every decision we make and every interaction we have with customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-8">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose LaptopStore?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We go above and beyond to ensure you have the best shopping experience possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind LaptopStore who make it all possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4">
                    <img
                      src={member.image ?? "/placeholder.svg"}
                      alt={member.name ?? ""}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Laptop?</h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Browse our extensive collection of laptops, accessories, and parts. 
                Our expert team is here to help you make the right choice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/categories/laptops">
                  <Button variant="secondary" size="lg">
                    Shop Laptops
                  </Button>
                </Link>
                <Link to="/contact-us">
                  <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;