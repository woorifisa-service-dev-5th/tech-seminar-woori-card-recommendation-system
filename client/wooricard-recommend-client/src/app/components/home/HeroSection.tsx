interface HeroSectionProps {
    title: string;
    subtitle?: string;
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
    return (
        <div className='text-center space-y-6 mb-12'>
            <h1 className='text-5xl md:text-6xl font-bold text-foreground text-balance'>
                {title}
            </h1>
            {subtitle && (
                <p className='text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty'>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
