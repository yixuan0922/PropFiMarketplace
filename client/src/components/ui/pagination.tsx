import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  // Helper to create page buttons
  const getPageButtons = () => {
    const buttons = [];
    
    // Always show first page
    buttons.push(
      <Button
        key={1}
        variant={currentPage === 1 ? 'default' : 'outline'}
        size="sm"
        onClick={() => onPageChange(1)}
      >
        1
      </Button>
    );
    
    // Add ellipsis if there are pages between first page and current page range
    if (currentPage > 3) {
      buttons.push(
        <Button
          key="ellipsis1"
          variant="outline"
          size="sm"
          disabled
        >
          ...
        </Button>
      );
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last page as they are always shown
      
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }
    
    // Add ellipsis if there are pages between current page range and last page
    if (currentPage < totalPages - 2) {
      buttons.push(
        <Button
          key="ellipsis2"
          variant="outline"
          size="sm"
          disabled
        >
          ...
        </Button>
      );
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }
    
    return buttons;
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>
      
      <div className="flex items-center space-x-2">
        {getPageButtons()}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}
