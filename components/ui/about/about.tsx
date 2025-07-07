import styles from "./about.module.css";

export function About() {
  return (
    <div className={styles.about}>
      <div className={styles.section}>
        <h3>Welcome to The Recipe Room</h3>
        <p>
            The Recipe Room is a digital cookbook — a place to collect, save, and easily find your favorite recipes. 
            Whether you&apos;re bookmarking dishes from the web, saving family favorites, or building your own recipe archive, 
            this app helps you stay organized and quickly access the meals you love.
        </p>
      </div>

      <div className={styles.section}>
        <h3>Why I Built This</h3>
        <p>
            As someone who loves cooking but often struggled with keeping track of recipes from cookbooks, handwritten notes, online blogs, and family traditions, 
            I wanted to create a simple, beautiful solution that brings all my recipes together in one easy-to-use space.
        </p>
        <p>
            The idea came from the frustration of losing track of recipes and spending too much time searching. 
            I built The Recipe Room to be a personal digital cookbook — a place where my favorite recipes are always within reach, organized, and ready to inspire my next meal.
        </p>
      </div>

      <div className={styles.section}>
        <h3>Key Features</h3>
        <ul>
        <li>
            <strong>Smart Recipe Management:</strong> Organize your recipes with categories, search 
            functionality, and easy editing capabilities.
          </li>
          <li>
            <strong>AI Chef Assistant:</strong> Get cooking advice, ingredient substitutions, and 
            recipe modifications from our AI chef.
          </li>
          <li>
            <strong>AI-Powered Recipe Extraction:</strong> Upload photos of recipes from cookbooks, 
            handwritten notes, or any recipe image, and our AI will automatically extract all the details.
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3>Future Plans</h3>
        <p>
          This is just the beginning! I&apos;m constantly working on new features including:
        </p>
        <ul>
          <li>Shopping list generation from recipes</li>
          <li>Meal planning and scheduling</li>
          <li>Recipe sharing with friends and family</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3>Get in Touch</h3>
        <p>
            I&apos;d love to hear your feedback, suggestions, or even just chat about cooking! The Recipe Room was built with a love for food, and I&apos;m always looking for ways to make it better for you.
        </p>
        <p>
            Whether you&apos;re a home cook, a professional chef, or somewhere in between, I hope The Recipe Room becomes a go-to space for your favorite recipes.
        </p>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          <em>Happy cooking!</em>
          <img src="/assets/chef-gusto-arms-crossed.png" alt="Chef Gusto" style={{ width: "60px", height: "60px" }}/>
        </p>
      </div>
    </div>
  );
} 