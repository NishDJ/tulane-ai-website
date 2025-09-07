import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatTime, slugify, truncateText } from '../utils';

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });

    it('should handle conditional classes', () => {
      expect(cn('base-class', true && 'conditional-class')).toBe('base-class conditional-class');
      expect(cn('base-class', false && 'conditional-class')).toBe('base-class');
    });

    it('should handle arrays and objects', () => {
      expect(cn(['class1', 'class2'], { 'class3': true, 'class4': false })).toBe('class1 class2 class3');
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
      expect(cn('', null, undefined)).toBe('');
    });
  });

  describe('formatDate', () => {
    it('should format Date objects correctly', () => {
      const date = new Date('2023-12-25T12:00:00Z');
      expect(formatDate(date)).toBe('December 25, 2023');
    });

    it('should format date strings correctly', () => {
      expect(formatDate('2023-01-01T12:00:00Z')).toBe('January 1, 2023');
    });

    it('should handle different date formats', () => {
      expect(formatDate('2023-06-15T10:30:00Z')).toBe('June 15, 2023');
    });
  });

  describe('formatTime', () => {
    it('should format time from Date objects', () => {
      const date = new Date('2023-12-25T14:30:00');
      expect(formatTime(date)).toBe('2:30 PM');
    });

    it('should format time from date strings', () => {
      expect(formatTime('2023-01-01T09:15:00')).toBe('9:15 AM');
    });

    it('should handle midnight and noon correctly', () => {
      expect(formatTime('2023-01-01T00:00:00')).toBe('12:00 AM');
      expect(formatTime('2023-01-01T12:00:00')).toBe('12:00 PM');
    });
  });

  describe('slugify', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
      expect(slugify('AI & Machine Learning')).toBe('ai-machine-learning');
    });

    it('should handle multiple spaces and hyphens', () => {
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
      expect(slugify('Already-Has-Hyphens')).toBe('already-has-hyphens');
    });

    it('should handle underscores', () => {
      expect(slugify('snake_case_text')).toBe('snake-case-text');
    });

    it('should handle empty strings', () => {
      expect(slugify('')).toBe('');
      expect(slugify('   ')).toBe('');
    });

    it('should handle numbers', () => {
      expect(slugify('Article 123')).toBe('article-123');
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than maxLength', () => {
      const text = 'This is a very long text that should be truncated';
      expect(truncateText(text, 20)).toBe('This is a very long...');
    });

    it('should not truncate text shorter than maxLength', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });

    it('should not break words in the middle', () => {
      const text = 'This is a test';
      expect(truncateText(text, 10)).toBe('This is a...');
    });

    it('should handle edge cases', () => {
      expect(truncateText('', 10)).toBe('');
      expect(truncateText('Word', 4)).toBe('Word');
      expect(truncateText('Word', 3)).toBe('Wor...');
    });

    it('should handle single word longer than maxLength', () => {
      expect(truncateText('Supercalifragilisticexpialidocious', 10)).toBe('Supercalif...');
    });
  });
});