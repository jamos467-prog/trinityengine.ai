# Trinity Engine Landing Page

A modern, responsive landing page for the Trinity Engine SaaS platform, featuring the same dark aesthetic and cyan accent colors as the desktop application.

## Features

- **Modern Design**: Dark theme with cyan accents matching Trinity Engine UI
- **Responsive**: Fully responsive design for all device sizes
- **Smooth Animations**: Intersection Observer for fade-in effects and smooth scrolling
- **Interactive Elements**: Hover effects, parallax scrolling, and animated cognitive ring visualization

## File Structure

```
C:\Dev\SaaS\
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # Interactive functionality
└── README.md       # This file
```

## Customization

### Colors
Edit the CSS variables in `styles.css`:
- `--accent-cyan`: Primary accent color (#33e7ff)
- `--bg-primary`: Main background color
- `--text-primary`: Primary text color

### Content
Update the HTML in `index.html`:
- Hero section text
- Feature descriptions
- Pricing tiers
- Footer links

### Functionality
Modify `script.js` to:
- Connect CTA form to your backend
- Add analytics tracking
- Customize animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

Simply upload all files to your web server. No build process required.

For production:
1. Minify CSS and JavaScript
2. Optimize images (if added)
3. Add analytics tracking
4. Set up form submission endpoint

