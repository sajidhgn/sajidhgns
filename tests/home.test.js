import React from "react";
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DashboardCard } from '@/components/home/dashboard-card'

describe('Home', () => {
  it('renders a heading', () => {
    render(<DashboardCard />)

    const heading = screen.getByText('View All')

    expect(heading).toBeInTheDocument()
  })
})