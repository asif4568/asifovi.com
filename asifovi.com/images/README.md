# Images Directory

This directory contains all the images used in your portfolio website.

## Directory Structure

### `/hero`
- **Purpose**: Hero section images
- **Usage**: Main hero image, background images for the header section
- **Recommended size**: 1920x1080px or larger
- **Formats**: JPG, PNG, WebP

### `/projects`
- **Purpose**: Project showcase images
- **Usage**: Thumbnails and featured images for your work projects
- **Recommended sizes**: 
  - Thumbnails: 810x810px
  - Featured: 1200x800px
- **Formats**: JPG, PNG, WebP

### `/gallery`
- **Purpose**: Additional gallery images
- **Usage**: Portfolio gallery, horizontal scrolling images, miscellaneous images
- **Recommended sizes**: Various (maintain aspect ratios)
- **Formats**: JPG, PNG, WebP, MP4 (for videos)

## Image Guidelines

1. **Optimization**: Compress images for web use
2. **Naming**: Use descriptive names (e.g., `project-twice-thumbnail.jpg`)
3. **Formats**: 
   - Photos: JPG
   - Graphics with transparency: PNG
   - Modern browsers: WebP
4. **Responsive**: Consider providing multiple sizes for different screen sizes

## Usage in HTML

To use images in your HTML, reference them like this:
```html
<!-- Hero image -->
<img src="images/hero/your-hero-image.jpg" alt="Description">

<!-- Project thumbnail -->
<div class="tile-image">
    <div class="overlay overlay-image lazy" 
         data-bg="images/projects/project-thumbnail.jpg">
    </div>
</div>

<!-- Gallery image -->
<div class="overlay lazy" 
     data-bg="images/gallery/gallery-image.jpg">
</div>
```

## Current Project Images

The website currently references these project images:
- TWICE (Interaction & Development)
- The Damai (Design & Development)  
- FABRIC™ (Design & Development)
- Aanstekelijk (Design & Development)

Replace the external URLs in the HTML with your local images in the `/projects` directory. 