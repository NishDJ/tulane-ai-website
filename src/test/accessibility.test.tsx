import { describe, it, expect } from 'vitest';
import { render } from '@/test/utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@/components/ui/button';
import { FacultyCard } from '@/components/faculty/faculty-card';
import { mockFacultyMember } from '@/test/utils';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('Button Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with different variants', async () => {
      const { container } = render(
        <div>
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations when disabled', async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with custom aria attributes', async () => {
      const { container } = render(
        <Button aria-label="Custom button" aria-describedby="button-description">
          Button
        </Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('FacultyCard Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<FacultyCard faculty={mockFacultyMember} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with minimal faculty data', async () => {
      const minimalFaculty = {
        id: 'minimal',
        name: 'Dr. Minimal',
        title: 'Professor',
        department: 'Department',
        email: 'minimal@example.com',
        bio: 'Short bio',
        researchAreas: ['Research'],
        education: [],
        publications: [],
        profileImage: '/test.jpg',
        isActive: true,
      };

      const { container } = render(<FacultyCard faculty={minimalFaculty} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with social links', async () => {
      const { container } = render(<FacultyCard faculty={mockFacultyMember} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Elements', () => {
    it('should not have violations with form inputs', async () => {
      const { container } = render(
        <form>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" required />
          
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required />
          
          <label htmlFor="message">Message</label>
          <textarea id="message" required></textarea>
          
          <Button type="submit">Submit</Button>
        </form>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with form validation errors', async () => {
      const { container } = render(
        <form>
          <label htmlFor="email-error">Email</label>
          <input 
            id="email-error" 
            type="email" 
            required 
            aria-invalid="true"
            aria-describedby="email-error-message"
          />
          <div id="email-error-message" role="alert">
            Please enter a valid email address
          </div>
        </form>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Navigation Elements', () => {
    it('should not have violations with navigation links', async () => {
      const { container } = render(
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/faculty">Faculty</a></li>
            <li><a href="/research">Research</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with breadcrumb navigation', async () => {
      const { container } = render(
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/faculty">Faculty</a></li>
            <li aria-current="page">Dr. John Doe</li>
          </ol>
        </nav>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Interactive Elements', () => {
    it('should not have violations with modal dialogs', async () => {
      const { container } = render(
        <div>
          <Button aria-haspopup="dialog" aria-expanded="false">
            Open Modal
          </Button>
          <div 
            role="dialog" 
            aria-labelledby="modal-title" 
            aria-describedby="modal-description"
            aria-hidden="true"
          >
            <h2 id="modal-title">Modal Title</h2>
            <p id="modal-description">Modal description</p>
            <Button>Close</Button>
          </div>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with dropdown menus', async () => {
      const { container } = render(
        <div>
          <Button 
            aria-haspopup="menu" 
            aria-expanded="false"
            aria-controls="dropdown-menu"
          >
            Menu
          </Button>
          <ul id="dropdown-menu" role="menu" aria-hidden="true">
            <li role="menuitem"><a href="/option1">Option 1</a></li>
            <li role="menuitem"><a href="/option2">Option 2</a></li>
            <li role="menuitem"><a href="/option3">Option 3</a></li>
          </ul>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Content Structure', () => {
    it('should not have violations with proper heading hierarchy', async () => {
      const { container } = render(
        <main>
          <h1>Main Title</h1>
          <section>
            <h2>Section Title</h2>
            <h3>Subsection Title</h3>
            <p>Content paragraph</p>
          </section>
          <section>
            <h2>Another Section</h2>
            <p>More content</p>
          </section>
        </main>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with lists', async () => {
      const { container } = render(
        <div>
          <h2>Unordered List</h2>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
          
          <h2>Ordered List</h2>
          <ol>
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
          </ol>
          
          <h2>Description List</h2>
          <dl>
            <dt>Term 1</dt>
            <dd>Description 1</dd>
            <dt>Term 2</dt>
            <dd>Description 2</dd>
          </dl>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Images and Media', () => {
    it('should not have violations with images', async () => {
      const { container } = render(
        <div>
          <img src="/test.jpg" alt="Descriptive alt text" />
          <img src="/decorative.jpg" alt="" role="presentation" />
          <figure>
            <img src="/chart.jpg" alt="Sales data chart showing 20% increase" />
            <figcaption>Sales increased by 20% this quarter</figcaption>
          </figure>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Tables', () => {
    it('should not have violations with data tables', async () => {
      const { container } = render(
        <table>
          <caption>Faculty Research Areas</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Department</th>
              <th scope="col">Research Area</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Dr. John Doe</th>
              <td>Computer Science</td>
              <td>Machine Learning</td>
            </tr>
            <tr>
              <th scope="row">Dr. Jane Smith</th>
              <td>Data Science</td>
              <td>Natural Language Processing</td>
            </tr>
          </tbody>
        </table>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});