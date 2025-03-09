# Modern Portfolio Website

A clean, responsive portfolio website template built with HTML, CSS, and JavaScript. Perfect for showcasing your work and skills as a developer, designer, or creative professional.

## Features

- **Modern Design**: Clean and professional layout with subtle animations
- **Fully Responsive**: Looks great on all devices (desktop, tablet, mobile)
- **Easy to Customize**: Simple structure and well-commented code
- **Smooth Scrolling**: Navigation with smooth scrolling effect
- **Mobile-First**: Built with a mobile-first approach
- **Contact Form**: Ready-to-use contact form (requires backend integration)
- **SEO Friendly**: Semantic HTML structure
- **Font Awesome Icons**: Integration with Font Awesome icons
- **Google Fonts**: Uses Poppins, a clean and modern font
- **Background Music**: Integrated background music player

## Live Demo

[View Live Demo](#) - Replace with your deployed URL once hosted

## Installation

1. Clone or download this repository
2. Open the project folder in your code editor
3. Customize the content to fit your needs
4. Deploy to your preferred hosting service

No build process or dependencies required - simple and straightforward!

## Customization

### Personal Information

- Edit `index.html` to update your name, job title, about information, skills, projects, and contact details
- Replace the placeholder project images with your own
- Update social media links with your profiles

### Colors and Styling

The website uses CSS variables for easy customization. Open `css/styles.css` and modify the root variables:

```css
:root {
    --primary-color: #5e3bee;
    --secondary-color: #6d44b8;
    --text-color: #2d2e32;
    --text-light: #767676;
    --bg-color: #fff;
    --bg-light: #f9f9f9;
    /* ... other variables */
}
```

### Profile Photo

To add your profile photo:

1. Add your photo to an `img` folder (create one if needed)
2. In `index.html`, find the hero section with class `.hero-image`
3. Replace the placeholder div with your image:

```html
<div class="hero-image">
    <img src="img/your-photo.jpg" alt="Your Name">
</div>
```

### Project Images

1. Add your project screenshots to the `img` folder
2. In `index.html`, find the project card sections
3. Replace the placeholder images with your project screenshots:

```html
<div class="project-img">
    <img src="img/your-project.jpg" alt="Project Name">
</div>
```

## Contact Form

The contact form is set up for demonstration purposes. To make it functional, you'll need to:

1. Create a backend service to process the form (PHP, Node.js, etc.)
2. Update the form action in `index.html`
3. Modify the submission handling in `js/script.js`

## Browser Support

The website is compatible with all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge
- Opera

## License

This project is available under the MIT License.

## Credits

- Font Awesome for icons
- Google Fonts for the Poppins font
- Placeholder images from [Placeholder.com](https://placeholder.com/)

## Background Music Setup

To add background music to your portfolio:

1. **Find Royalty-Free Music**: 
   - Download royalty-free ambient music from sites like:
     - [Pixabay](https://pixabay.com/music/search/ambient/)
     - [Free Music Archive](https://freemusicarchive.org/genre/Ambient/)
     - [Bensound](https://www.bensound.com/royalty-free-music/ambient)

2. **Prepare the Audio File**:
   - Convert your audio to MP3 format if needed
   - Optimize the file size (aim for under 3MB)
   - Rename it to `calm-ambient.mp3`

3. **Add to Your Website**:
   - Place the MP3 file in the `/audio` directory
   - The audio player is already set up in the HTML

4. **Customize (Optional)**:
   - Edit the audio player label in `index.html` (currently "Ambient Music")
   - Adjust the volume default in `js/audio-player.js`

## Usage

The audio player features:
- Play/Pause button
- Volume control slider
- Keyboard shortcut: Press 'M' to toggle music
- Auto-pauses when you leave the page
- Mobile-friendly controls

## Questions?

If you have any questions or need help customizing your portfolio, feel free to reach out! 