import { useEffect, useState } from 'react';
import './LikeButton.css';

const LikeButton = ({ buttonId, additionalClass = '', postLiked, onClick }) => {
  // State: true = Liked (Red/Full), false = Unliked (Empty/Whole)
  // We default to false (Unliked) as per your description, but you can pass an initial state.
  const [isLiked, setIsLiked] = useState(postLiked);

  useEffect(() => {
    setIsLiked(postLiked);
  }, [postLiked]);


  const handleClick = () => {
    setIsLiked(!isLiked);
    if (onClick) onClick();
  };

  return (
    <button 
      id={buttonId}
      key={isLiked ? "liked" : "unliked"}
      className={`heart-button ${isLiked ? 'liked' : 'unliked'} ${additionalClass}`}
      onClick={handleClick}
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      title={isLiked ? "Unlike" : "Like"}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <svg 
        width="30" 
        height="30" 
        viewBox="0 0 24 24" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* 1. The Heart Shape */}
        <path 
          className="heart-shape"
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
        />
        
        {/* 2. The Crack (Transient Animation Layer) */}
        <path 
          className="crack-path" 
          d="M12 5.67l-2 6 4-2-2 6" 
        /> 
      </svg>
    </button>
  );
};

export default LikeButton;