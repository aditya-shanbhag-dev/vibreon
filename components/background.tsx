export default function Background() {
    return (
        <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
                backgroundImage: `
                    repeating-linear-gradient(
                        45deg,
                        var(--grid-color) 0,
                        var(--grid-color) 1px,
                        transparent 1px,
                        transparent 20px
                    ),
                    repeating-linear-gradient(
                        -45deg,
                        var(--grid-color) 0,
                        var(--grid-color) 1px,
                        transparent 1px,
                        transparent 20px
                    )
                `,
                backgroundSize: "100px 100px",
            }}
        />

    );
}