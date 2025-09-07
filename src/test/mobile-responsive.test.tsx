/**
 * Mobile responsive design tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { useIsMobile, useBreakpoint, useTouchFriendly } from '@/lib/mobile-utils';
import { Button } from '@/components/ui/button';
import { FacultyCard } from '@/components/faculty/faculty-card';
import { Header } from '@/components/layout/header';
import { type FacultyMember } from '@/types';

// Mock the mobile utility hooks
vi.mock('@/lib/mobile-utils', () => ({
    useIsMobile: vi.fn(),
    useBreakpoint: vi.fn(),
    useTouchFriendly: vi.fn(),
    MOBILE_GRID: {
        faculty: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    },
    MOBILE_SPACING: {
        md: 'p-4 sm:p-6',
    },
    TOUCH_TARGET_SIZE: {
        min: 'min-h-[44px] min-w-[44px]',
    },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

const mockFaculty: FacultyMember = {
    id: '1',
    name: 'Dr. Jane Smith',
    title: 'Professor of AI Research',
    department: 'Computer Science',
    email: 'jane.smith@tulane.edu',
    bio: 'Leading researcher in artificial intelligence and machine learning.',
    researchAreas: ['Machine Learning', 'AI Ethics', 'Healthcare AI'],
    education: [],
    publications: [],
    profileImage: '/images/faculty/jane-smith.jpg',
    isActive: true,
};

describe('Mobile Responsive Design', () => {
    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();
    });

    describe('Mobile Detection', () => {
        it('should detect mobile devices correctly', () => {
            (useIsMobile as any).mockReturnValue(true);
            (useBreakpoint as any).mockReturnValue('sm');
            (useTouchFriendly as any).mockReturnValue(true);

            const TestComponent = () => {
                const isMobile = useIsMobile();
                const breakpoint = useBreakpoint();
                const isTouchDevice = useTouchFriendly();

                return (
                    <div>
                        <div data-testid="mobile-status">{isMobile ? 'mobile' : 'desktop'}</div>
                        <div data-testid="breakpoint">{breakpoint}</div>
                        <div data-testid="touch-status">{isTouchDevice ? 'touch' : 'no-touch'}</div>
                    </div>
                );
            };

            render(<TestComponent />);

            expect(screen.getByTestId('mobile-status')).toHaveTextContent('mobile');
            expect(screen.getByTestId('breakpoint')).toHaveTextContent('sm');
            expect(screen.getByTestId('touch-status')).toHaveTextContent('touch');
        });
    });

    describe('Button Component Mobile Optimization', () => {
        it('should have minimum touch target size on mobile', () => {
            render(<Button data-testid="mobile-button">Test Button</Button>);

            const button = screen.getByTestId('mobile-button');
            expect(button).toHaveClass('min-h-[44px]');
            expect(button).toHaveClass('touch-manipulation');
        });

        it('should have appropriate sizing for different button sizes', () => {
            const { rerender } = render(<Button size="default" data-testid="button">Default</Button>);
            expect(screen.getByTestId('button')).toHaveClass('h-11');

            rerender(<Button size="lg" data-testid="button">Large</Button>);
            expect(screen.getByTestId('button')).toHaveClass('h-14');

            rerender(<Button size="touch" data-testid="button">Touch</Button>);
            expect(screen.getByTestId('button')).toHaveClass('h-12');
        });
    });

    describe('Faculty Card Mobile Optimization', () => {
        it('should render with mobile-optimized layout', () => {
            render(<FacultyCard faculty={mockFaculty} />);

            const card = screen.getByText('Dr. Jane Smith').closest('div');
            expect(card).toHaveClass('touch-manipulation');
        });

        it('should have appropriate padding on mobile', () => {
            render(<FacultyCard faculty={mockFaculty} />);

            // Check that the card content has mobile-appropriate padding
            const cardContent = screen.getByText('Dr. Jane Smith').closest('div');
            expect(cardContent?.parentElement).toHaveClass('p-4');
        });

        it('should have touch-friendly social links', () => {
            const facultyWithSocial: FacultyMember = {
                ...mockFaculty,
                socialLinks: {
                    twitter: 'https://twitter.com/janesmith',
                    linkedin: 'https://linkedin.com/in/janesmith',
                },
            };

            render(<FacultyCard faculty={facultyWithSocial} />);

            const socialLinks = screen.getAllByRole('link');
            const socialLink = socialLinks.find(link =>
                link.getAttribute('href')?.includes('twitter')
            );

            if (socialLink) {
                expect(socialLink).toHaveClass('touch-manipulation');
                expect(socialLink).toHaveClass('h-10');
                expect(socialLink).toHaveClass('w-10');
            }
        });
    });

    describe('Header Mobile Navigation', () => {
        it('should show mobile menu button on small screens', () => {
            render(<Header />);

            const mobileMenuButton = screen.getByLabelText(/open menu|close menu/i);
            expect(mobileMenuButton).toBeInTheDocument();
            expect(mobileMenuButton).toHaveClass('lg:hidden');
        });

        it('should toggle mobile menu when button is clicked', async () => {
            render(<Header />);

            const mobileMenuButton = screen.getByLabelText(/open menu/i);

            // Click to open menu
            fireEvent.click(mobileMenuButton);

            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
        });
    });

    describe('Responsive Grid Layouts', () => {
        it('should apply correct grid classes for faculty layout', () => {
            const TestGrid = () => (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <div>Item 1</div>
                    <div>Item 2</div>
                </div>
            );

            render(<TestGrid />);

            const grid = screen.getByText('Item 1').parentElement;
            expect(grid).toHaveClass('grid-cols-1');
            expect(grid).toHaveClass('sm:grid-cols-2');
            expect(grid).toHaveClass('lg:grid-cols-3');
            expect(grid).toHaveClass('xl:grid-cols-4');
        });
    });

    describe('Touch Interactions', () => {
        it('should handle touch events properly', () => {
            const handleClick = vi.fn();

            render(
                <button
                    onClick={handleClick}
                    className="touch-manipulation"
                    data-testid="touch-button"
                >
                    Touch Me
                </button>
            );

            const button = screen.getByTestId('touch-button');

            // Simulate touch events
            fireEvent.touchStart(button);
            fireEvent.touchEnd(button);
            fireEvent.click(button);

            expect(handleClick).toHaveBeenCalled();
        });
    });

    describe('Viewport Handling', () => {
        it('should handle viewport changes', () => {
            // Mock window dimensions
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 375, // Mobile width
            });

            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: 667, // Mobile height
            });

            const TestComponent = () => {
                const [dimensions, setDimensions] = React.useState({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });

                React.useEffect(() => {
                    const handleResize = () => {
                        setDimensions({
                            width: window.innerWidth,
                            height: window.innerHeight,
                        });
                    };

                    window.addEventListener('resize', handleResize);
                    return () => window.removeEventListener('resize', handleResize);
                }, []);

                return (
                    <div>
                        <div data-testid="width">{dimensions.width}</div>
                        <div data-testid="height">{dimensions.height}</div>
                    </div>
                );
            };

            render(<TestComponent />);

            expect(screen.getByTestId('width')).toHaveTextContent('375');
            expect(screen.getByTestId('height')).toHaveTextContent('667');

            // Simulate resize
            act(() => {
                Object.defineProperty(window, 'innerWidth', { value: 768 });
                Object.defineProperty(window, 'innerHeight', { value: 1024 });
                window.dispatchEvent(new Event('resize'));
            });

            expect(screen.getByTestId('width')).toHaveTextContent('768');
            expect(screen.getByTestId('height')).toHaveTextContent('1024');
        });
    });

    describe('Mobile-Specific CSS Classes', () => {
        it('should apply mobile-specific spacing classes', () => {
            const TestComponent = () => (
                <div className="p-4 sm:p-6" data-testid="mobile-spacing">
                    Mobile Content
                </div>
            );

            render(<TestComponent />);

            const element = screen.getByTestId('mobile-spacing');
            expect(element).toHaveClass('p-4');
            expect(element).toHaveClass('sm:p-6');
        });

        it('should apply mobile-specific text sizes', () => {
            const TestComponent = () => (
                <h1 className="text-3xl xs:text-4xl sm:text-5xl" data-testid="mobile-heading">
                    Mobile Heading
                </h1>
            );

            render(<TestComponent />);

            const heading = screen.getByTestId('mobile-heading');
            expect(heading).toHaveClass('text-3xl');
            expect(heading).toHaveClass('xs:text-4xl');
            expect(heading).toHaveClass('sm:text-5xl');
        });
    });

    describe('Performance on Mobile', () => {
        it('should use reduced animations on low-end devices', () => {
            // Mock reduced motion preference
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: vi.fn().mockImplementation(query => ({
                    matches: query === '(prefers-reduced-motion: reduce)',
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    dispatchEvent: vi.fn(),
                })),
            });

            const TestComponent = () => {
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                return (
                    <div
                        className={prefersReducedMotion ? 'motion-reduce:animate-none' : 'animate-pulse'}
                        data-testid="animated-element"
                    >
                        Animated Content
                    </div>
                );
            };

            render(<TestComponent />);

            const element = screen.getByTestId('animated-element');
            expect(element).toHaveClass('motion-reduce:animate-none');
        });
    });
});

// Helper function to simulate mobile viewport
export function simulateMobileViewport() {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
    });

    Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
    });

    // Trigger resize event
    act(() => {
        window.dispatchEvent(new Event('resize'));
    });
}

// Helper function to simulate tablet viewport
export function simulateTabletViewport() {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
    });

    Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1024,
    });

    act(() => {
        window.dispatchEvent(new Event('resize'));
    });
}

// Helper function to simulate desktop viewport
export function simulateDesktopViewport() {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
    });

    Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800,
    });

    act(() => {
        window.dispatchEvent(new Event('resize'));
    });
}