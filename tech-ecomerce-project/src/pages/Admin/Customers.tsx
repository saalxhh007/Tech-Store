import { useEffect, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './../../components/ui/table';
import { Input } from './../../components/ui/input';
import { Customer, fetchCustomers } from './../../data/adminMockData';
import { useSelector } from "react-redux"
import { RootState } from '../../store';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  

  const filteredCustomers = customers.filter(customer =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadCustomers = async () => {
    if (accessToken) {
      const data = await fetchCustomers(accessToken ?? "");
      setCustomers(data); 
    }
  }

  useEffect(() => {
    loadCustomers();
  }, [accessToken]);
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary">Customers</h1>
        <p className="text-muted-foreground mt-1">Manage your customer base</p>
      </div>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers && filteredCustomers.length > 0 ?
              (filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{customer.fullName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-muted-foreground" />
                      {customer.email}
                    </div>
                  </TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell className="font-medium">
                    {/* {customer.totalSpent.toFixed(2)} DA */}
                  </TableCell>
                  <TableCell>{customer.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-secondary hover:text-primary transition-colors">
                        <Mail size={16} />
                      </button>
                      <button className="text-secondary hover:text-primary transition-colors">
                        <Phone size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))) : (
                  <p>No Customers Exists</p>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}