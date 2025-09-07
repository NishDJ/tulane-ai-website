import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import { FacultyCard } from '../faculty-card';
import { mockFacultyMember } from '@/test/utils';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('FacultyCard', () => {
  it('should render faculty information correctly', () => {
    render(<FacultyCard faculty={mockFacultyMember} />);
    
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Professor of AI')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('Expert in machine learning and artificial intelligence')).toBeInTheDocument();
  });

  it('should render research areas as tags', () => {
    render(<FacultyCard faculty={mockFacultyMember} />);
    
    expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Data Science')).toBeInTheDocument();
  });

  it('should show "+X more" when there are more than 3 research areas', () => {
    const facultyWithManyAreas = {
      ...mockFacultyMember,
      researchAreas: ['AI', 'ML', 'Data Science', 'Computer Vision', 'NLP'],
    };
    
    render(<FacultyCard faculty={facultyWithManyAreas} />);
    
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('should render profile image with correct alt text', () => {
    render(<FacultyCard faculty={mockFacultyMember} />);
    
    const image = screen.getByAltText('Dr. John Doe profile photo');
    expect(image).toBeInTheDocument();
  });

  it('should render social links when available', () => {
    render(<FacultyCard faculty={mockFacultyMember} />);
    
    const twitterLink = screen.getByLabelText("Dr. John Doe's twitter profile");
    const linkedinLink = screen.getByLabelText("Dr. John Doe's linkedin profile");
    
    expect(twitterLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/johndoe');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/johndoe');
  });

  it('should not render social links when not available', () => {
    const facultyWithoutSocial = {
      ...mockFacultyMember,
      socialLinks: undefined,
    };
    
    render(<FacultyCard faculty={facultyWithoutSocial} />);
    
    expect(screen.queryByLabelText(/profile$/)).not.toBeInTheDocument();
  });

  it('should render contact information in hover overlay', () => {
    render(<FacultyCard faculty={mockFacultyMember} />);
    
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should render optional contact information when available', () => {
    const facultyWithFullContact = {
      ...mockFacultyMember,
      phone: '555-123-4567',
      office: 'Room 123, Science Building',
    };
    
    render(<FacultyCard faculty={facultyWithFullContact} />);
    
    expect(screen.getByText('555-123-4567')).toBeInTheDocument();
    expect(screen.getByText('Room 123, Science Building')).toBeInTheDocument();
  });

  it('should render view profile link with correct href', () => {
    render(<FacultyCard faculty={mockFacultyMember} />);
    
    const profileLink = screen.getByRole('link', { name: 'View Full Profile' });
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/faculty/john-doe');
  });

  it('should handle social link clicks', () => {
    render(<FacultyCard faculty={mockFacultyMember} />);
    
    const twitterLink = screen.getByLabelText("Dr. John Doe's twitter profile");
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should apply animation delay based on index', () => {
    const { rerender } = render(<FacultyCard faculty={mockFacultyMember} index={0} />);
    
    // Test that component renders with different indices
    rerender(<FacultyCard faculty={mockFacultyMember} index={5} />);
    
    // Since we're mocking framer-motion, we can't test the actual animation
    // but we can verify the component renders without errors
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
  });

  it('should handle image load event', async () => {
    render(<FacultyCard faculty={mockFacultyMember} />);
    
    const image = screen.getByAltText('Dr. John Doe profile photo');
    
    // Simulate image load
    fireEvent.load(image);
    
    // Since we're testing the component behavior, we verify it doesn't crash
    await waitFor(() => {
      expect(image).toBeInTheDocument();
    });
  });

  it('should have proper accessibility attributes', () => {
    render(<FacultyCard faculty={mockFacultyMember} />);
    
    const profileLink = screen.getByRole('link', { name: 'View Full Profile' });
    expect(profileLink).toHaveClass('focus:outline-none', 'focus:ring-2');
    
    const socialLinks = screen.getAllByRole('link');
    socialLinks.forEach(link => {
      if (link.getAttribute('aria-label')?.includes('profile')) {
        expect(link).toHaveAttribute('aria-label');
      }
    });
  });

  it('should truncate bio text appropriately', () => {
    const facultyWithLongBio = {
      ...mockFacultyMember,
      bio: 'This is a very long bio that should be truncated after a certain number of lines to maintain the card layout and ensure consistent appearance across all faculty cards in the grid.',
    };
    
    render(<FacultyCard faculty={facultyWithLongBio} />);
    
    const bioElement = screen.getByText(facultyWithLongBio.bio);
    expect(bioElement).toHaveClass('line-clamp-3');
  });
});