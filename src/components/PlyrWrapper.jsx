export default function PlyrWrapper({ videoId, className = '' }) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#000'
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&fs=1`}
        title="Video Player"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}
