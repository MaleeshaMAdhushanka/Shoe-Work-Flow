'use client'

import {  useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

import { useDebouncedCallback } from 'use-debounce';
import { Customer } from '@/app/lib/types';

interface CustomerSelectProps {
  selected: Customer | null;
  onSelect: (customer: Customer | null) => void;
}

export function CustomerSelect({ selected, onSelect }: CustomerSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchCustomers = useDebouncedCallback(async (term: string) => {
    if (!term.trim()) {
      setCustomers([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/customers/search?query=${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  return (
    <div className="mb-2 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Customer
      </label>
      
      <div
        className="relative border border-gray-300 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="px-4 py-2.5 flex items-center justify-between">
          {selected ? (
            <div className='flex gap-3 items-center' >
              <div className="font-medium">{selected.name}</div>
              <div className="text-sm text-gray-600">{selected.email}</div>
            </div>
          ) : (
            <span className="text-gray-500">Select a customer</span>
          )}
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-2 border-b border-neutral-300">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search customers..."
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => searchCustomers(e.target.value)}
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : customers.length > 0 ? (
                customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(customer);
                      setIsOpen(false);
                    }}
                  >
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-600">{customer.email}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No customers found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}