import { useState } from 'react';
import { Button } from './../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './../components/ui/card';
import { Input } from './../components/ui/input';
import { Label } from './../components/ui/label';
import { Textarea } from './../components/ui/textarea';
import { Badge } from './../components/ui/badge';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 5pm'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@laptopstore.com',
      description: 'Online support 24/7'
    },
    {
      icon: MapPin,
      title: 'Office',
      content: '123 Tech Street, Digital City, DC 12345',
      description: 'Visit our physical store'
    },
    {
      icon: Clock,
      title: 'Hours',
      content: 'Monday - Friday: 8am - 5pm',
      description: 'Saturday: 9am - 3pm'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-cta text-cta-foreground mb-4">Get in Touch</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products or need technical support? 
            We're here to help you find the perfect laptop solution.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What can we help you with?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{info.title}</h3>
                            <p className="text-foreground font-medium">{info.content}</p>
                            <p className="text-sm text-muted-foreground">{info.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* FAQ Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <div className="text-left">
                      <div className="font-medium">What's your return policy?</div>
                      <div className="text-sm text-muted-foreground">30-day money-back guarantee</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <div className="text-left">
                      <div className="font-medium">Do you offer warranties?</div>
                      <div className="text-sm text-muted-foreground">All products include manufacturer warranty</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <div className="text-left">
                      <div className="font-medium">How fast is shipping?</div>
                      <div className="text-sm text-muted-foreground">Free 2-day shipping on orders over 20000 DA</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <div className="text-left">
                      <div className="font-medium">Do you offer technical support?</div>
                      <div className="text-sm text-muted-foreground">Yes, we provide expert tech support</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Support */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Need Immediate Help?</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  For urgent technical issues or order problems
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support: +1 (555) 123-4567
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Visit Our Store</h2>
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Interactive map would be embedded here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    123 Tech Street, Digital City, DC 12345
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;