import os
import re

def main():
    with open('montserrat-digital-residency-zh.html', 'r', encoding='utf-8') as f:
        html_zh = f.read()
    
    # We will just write a simple `src/app/zh/page.tsx` that uses dangerouslySetInnerHTML 
    # for the pure static sections but keeps Navbar/Footer!
    # No, that breaks functionality for interactive card.
    
    # Let's clone components!
    # Or, even simpler... 
    pass

if __name__ == '__main__':
    main()
