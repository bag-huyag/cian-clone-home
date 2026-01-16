const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © ЦИАН, 2024
          </div>
          
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              О компании
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Помощь
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Контакты
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
