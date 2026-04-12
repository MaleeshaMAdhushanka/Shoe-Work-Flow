import { NextRequest, NextResponse } from 'next/server';
import { fetchFilteredCustomers } from '@/app/lib/customer/customer-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';

  try {
    const customers = await fetchFilteredCustomers(query, 1); 
    return NextResponse.json(customers);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}