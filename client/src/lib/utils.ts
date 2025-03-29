import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names with Tailwind CSS optimization
 * 
 * @param inputs - Array of class values or conditional class objects
 * @returns Optimized class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Enhanced version of cn with theme support
 * 
 * @param inputs - Array of class values or conditional class objects
 * @param theme - Optional theme override (light/dark)
 * @returns Optimized class string with theme consideration
 */
export function cnThemed(theme: 'light' | 'dark' | undefined, ...inputs: ClassValue[]) {
  // Apply theme-specific classes based on the theme parameter
  const themeClasses = theme === 'light' 
    ? 'bg-white text-neutral-900'
    : theme === 'dark'
      ? 'bg-neutral-900 text-white'
      : '';
      
  return twMerge(clsx(themeClasses, inputs));
}

/**
 * Creates variants of class combinations for component styling
 * 
 * @param variants - Record of variant types and their class values
 * @returns A function that combines the variants based on props
 */
export function createVariants<Variants extends Record<string, Record<string, string>>>(
  variants: Variants
) {
  type VariantProps = {
    [K in keyof Variants]?: keyof Variants[K];
  };
  
  return (props: VariantProps & { className?: string }) => {
    const { className, ...variantProps } = props;
    
    const variantClasses = Object.keys(variantProps).map((variant) => {
      const variantKey = variant as keyof Variants;
      const variantValue = variantProps[variantKey] as keyof Variants[typeof variantKey];
      
      return variants[variantKey][variantValue as string];
    });
    
    return cn(...variantClasses, className);
  };
}

/**
 * Utility for responsive class generation
 * 
 * @param mobile - Classes to apply on mobile screens
 * @param tablet - Classes to apply on tablet screens
 * @param desktop - Classes to apply on desktop screens
 * @returns Combined responsive class string
 */
export function responsive(
  mobile: string, 
  tablet?: string, 
  desktop?: string
) {
  return cn(
    mobile,
    tablet ? `sm:${tablet}` : '',
    desktop ? `lg:${desktop}` : ''
  );
}
