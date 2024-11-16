export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="absolute w-full h-[100vh] top-0 left-0">
            <div className="absolute w-full h-[2px] z-50 top-0 left-0 bg-foreground"></div>
        </div>
    )
}