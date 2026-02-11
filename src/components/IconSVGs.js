export const LikeIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);


export const UnlikeIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    <path d="M12 5.67l-2 6 4-2-2 6" /> 
  </svg>
);

export const EditIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
    className="animated-pen-icon">
  <style>
    {`
      /* 1. INITIAL STATES */
      .animated-pen-icon {
        cursor: pointer;
        overflow: visible;
      }

      /* Ink Lines */
      .ink-line {
        /* Increased to 35 because the scribble is much longer than the paper width */
        stroke-dasharray: 35; 
        stroke-dashoffset: 35;
        opacity: 0;
        fill: none;
      }

      #pen {
        transform-box: fill-box;
        transform-origin: center center;
        transition: transform 0.5s ease-in-out;
      
      }

      /* 2. HOVER TRIGGERS */
      
      .animated-pen-icon:hover #pen {
        animation: writeSequence 1s linear forwards;
      }

      /* Line Animations */
      .animated-pen-icon:hover .line1 {
        animation: drawLine 0.3s linear forwards;
        animation-delay: 0.1s; 
      }

      .animated-pen-icon:hover .line2 {
        animation: drawLine 0.3s linear forwards;
        animation-delay: 0.4s; 
      }

      .animated-pen-icon:hover .line3 {
        animation: drawLine 0.3s linear forwards;
        animation-delay: 0.7s; 
      }

      /* 3. KEYFRAMES */

      @keyframes drawLine {
        0% {
          stroke-dashoffset: 35;
          opacity: 1;
        }
        100% {
          stroke-dashoffset: 0;
          opacity: 1;
        }
      }

      @keyframes writeSequence {
        /* Since the scribble frequency is high, the pen moves linearly 
          across the paper. Attempting to animate the pen Up/Down 
          for every single wave peak at this speed would look glitchy.
        */

        /* --- LINE 1 (Bottom) --- */
        0% { transform: translate(-7px, 2px); }
        15% { transform: translate(5px, 2px); }
        
        /* --- LINE 2 (Middle) --- */
        30% { transform: translate(-7px, -2px); }
        45% { transform: translate(5px, -2px); }

        /* --- LINE 3 (Top) --- */
        60% { transform: translate(-7px, -6px); }
        75% { transform: translate(5px, -6px); }
        
        /* --- FINISH --- */
        100% { transform: translate(9.2px, 3px) rotate(-45deg); }
      }
    `}
    
  </style>

  <g transform="scale(0.9 0.9) translate(0 2.5)"> 
    <path id="paper" d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/> 
    
    <g id="lines" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path className="ink-line line1" d="M5 18 Q 5.5 17, 6 18 T 7 18 T 8 18 T 9 18 T 10 18 T 11 18 T 12 18 T 13 18 T 14 18 T 15 18 T 16 18 T 17 18" />
      
      <path className="ink-line line2" d="M5 14 Q 5.5 13, 6 14 T 7 14 T 8 14 T 9 14 T 10 14 T 11 14 T 12 14 T 13 14 T 14 14 T 15 14 T 16 14 T 17 14" />
      
      <path className="ink-line line3" d="M5 10 Q 5.5 9, 6 10 T 7 10 T 8 10 T 9 10 T 10 10 T 11 10 T 12 10 T 13 10 T 14 10 T 15 10 T 16 10 T 17 10" />
    </g>

    <path id="pen" d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/> 
  </g>
</svg>
);




export const DeleteIcon = ({ size = 24, color = "currentColor", ...props }) => (
 <svg 
  xmlns="http://www.w3.org/2000/svg"
  width={size} 
  height={size}
  viewBox="0 0 24 24" 
  fill="none"
  stroke={color} 
  strokeWidth="2" 
  strokeLinecap="round" 
  strokeLinejoin="round"
  {...props} 
 >
  <style>
    {`
      svg{cursor: pointer;}
      
      #trash-cover{transition: transform 0.2s ease-in-out;}
      svg:hover #trash-cover{transform: rotate(-20deg) translate(-2px, -1px);}
    `}
  </style>
  <g strokeWidth="1" transform="translate(0 2.7)"> 
    <path id="trash-body" d="M5 7.5H19L18 21H6L5 7.5Z" stroke="#000000" strokeLinejoin="round"/>
    <path id="line1" d="M15.5 9.5L15 19" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
    <path id="line2" d="M12 9.5V19" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/> 
    <path id="line3" d="M8.5 9.5L9 19" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
    <g transform="translate(0 0)">
      <path id="trash-cover" d="M16 5H19C20.1046 5 21 5.89543 21 7V7.5H3V7C3 5.89543 3.89543 5 5 5H8M16 5L15 3H9L8 5M16 5H8" stroke="#000000" strokeLinejoin="round"/>
    </g>
  </g>
 </svg>
);


export const ManageGroupIcon = ({ size = 24, color = "currentColor", ...props }) => (
<svg  
  xmlns="http://www.w3.org/2000/svg" 
  width={size} 
  height={size}
  viewBox="0 0 24 24" 
  stroke={color}
  strokeLinecap="round" 
  strokeLinejoin="round"
  strokeWidth="3" 
  fill="none"
  {...props}>
  <style>
  {`
    svg{
      cursor: pointer;
    }
    .gear{
      transform-origin: 12px 12px;
      -webkit-animation:spin 10s linear infinite;
      -moz-animation:spin 10s linear infinite;
      animation:spin 10s linear infinite;
      -webkit-animation-play-state: paused;
      -moz-animation-play-state: paused;
      animation-play-state: paused;
    }
    svg:hover .gear{
      -webkit-animation-play-state: running;
      -moz-animation-play-state: running;
      animation-play-state: running;
    }
    @-moz-keyframes spin { 
    100% { -moz-transform: rotate(360deg); } 
    }
    @-webkit-keyframes spin { 
        100% { -webkit-transform: rotate(360deg); } 
    }
    @keyframes spin { 
        100% { 
            -webkit-transform: rotate(360deg); 
            transform:rotate(360deg); 
        } 
  `}
  </style>
  <g strokeWidth="1" transform="scale(0.40 0.4) translate(-2 15)">
    <g strokeWidth="2">
      <circle cx="31.89" cy="22.71" r="5.57"/>
      <path d="M43.16,43.74A11.28,11.28,0,0,0,31.89,32.47h0A11.27,11.27,0,0,0,20.62,43.74Z"/>
      <circle id="person1head" cx="48.46" cy="22.71" r="5.57"/>
      <path id="person1body" d="M46.87,43.74H59.73A11.27,11.27,0,0,0,48.46,32.47h0a11.24,11.24,0,0,0-5.29,1.32"/>
      <circle id="person2head" cx="15.54" cy="22.71" r="5.57"/>
      <path id="person2body" d="M17.13,43.74H4.27A11.27,11.27,0,0,1,15.54,32.47h0a11.24,11.24,0,0,1,5.29,1.32"/>
    </g>
    <g transform="translate(20 -23) scale(2 2)">
      <path class="gear" fillRule="evenodd" clipRule="evenodd" d="M17.2994 10.4527L19.2267 10.7677C19.3846 10.7935 19.5003 10.9298 19.5 11.0896V12.883C19.5 13.0412 19.3865 13.1768 19.2303 13.2042L17.3004 13.543C17.1885 13.9298 17.0349 14.3022 16.8415 14.6543L17.9823 16.2382C18.0759 16.3679 18.0612 16.5463 17.9483 16.6595L16.6804 17.9283C16.5682 18.0401 16.3921 18.0561 16.2623 17.9645L14.6627 16.8424C14.3099 17.0387 13.9352 17.1952 13.5442 17.3103L13.2034 19.231C13.176 19.3865 13.0406 19.5 12.8825 19.5H11.0888C10.9294 19.5 10.7934 19.3849 10.7676 19.228L10.4493 17.3168C10.059 17.204 9.6823 17.0485 9.32585 16.8525L7.73767 17.9648C7.60821 18.0558 7.43178 18.0401 7.31992 17.9283L6.05198 16.6595C5.93947 16.5463 5.9248 16.3686 6.01741 16.2391L7.13958 14.6697C6.94163 14.3116 6.78444 13.9337 6.67062 13.5414L4.76905 13.2042C4.61349 13.1765 4.5 13.0412 4.5 12.883V11.0896C4.5 10.9304 4.61544 10.7941 4.77263 10.768L6.67421 10.4514C6.78868 10.0582 6.94586 9.68022 7.14316 9.32315L6.0347 7.73739C5.94371 7.60793 5.95937 7.43185 6.07122 7.32L7.33883 6.0525C7.452 5.94 7.62908 5.925 7.7592 6.01793L9.33433 7.14293C9.68817 6.94924 10.0639 6.795 10.4552 6.6825L10.767 4.77359C10.7927 4.61576 10.929 4.5 11.0888 4.5H12.8825C13.041 4.5 13.1763 4.61413 13.2037 4.77L13.5399 6.68935C13.929 6.8025 14.304 6.95837 14.6591 7.15467L16.2385 6.01957C16.3683 5.92598 16.5464 5.94065 16.6595 6.05348L17.9278 7.32098C18.0397 7.43315 18.0553 7.60957 17.9643 7.73902L16.8392 9.34239C17.0323 9.69424 17.1865 10.066 17.2994 10.4527ZM9.71725 12C9.71725 13.2607 10.7393 14.2826 12.0001 14.2826C13.2608 14.2826 14.2829 13.2607 14.2829 12C14.2829 10.7394 13.2608 9.71742 12.0001 9.71742C10.7393 9.71742 9.71725 10.7394 9.71725 12Z" />
    </g>
  </g></svg>
);


export const GroupChatIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    {`
      #bubble1-dot1,#bubble1-dot2,#bubble2-dot1,#bubble2-dot2{
        opacity:0;
      }

      #bubble1-dot1{ transition: opacity 0.2s ease-in-out;}
      #bubble1-dot2{ transition: opacity 0.6s ease-in-out;}
      #bubble2-dot1{ transition: opacity 1s ease-in-out;}
      #bubble2-dot2{ transition: opacity 1.4s ease-in-out;}
      
      
      svg:hover #dots > *{
        opacity:1;
      }
    `}
  </style>
  <g> 
  <path id="bubble1" d="M0.25 10.2145C0.25 6.24636 4.05525 3.25 8.45161 3.25C11.9502 3.25 15.0521 5.13375 16.1918 7.89933C16.243 8.02337 16.154 8.15792 16.0203 8.16898C15.648 8.19978 15.2782 8.25265 14.9138 8.32662C14.8207 8.34551 14.7269 8.29807 14.6853 8.2127C13.7216 6.23442 11.3546 4.75 8.45161 4.75C4.61715 4.75 1.75 7.31827 1.75 10.2145C1.75 11.7791 2.56392 13.224 3.9325 14.2455C4.12216 14.3871 4.23387 14.6099 4.23387 14.8465V15.7873L5.78151 15.357C5.9163 15.3196 6.05888 15.3205 6.19314 15.3598C6.80385 15.5387 7.45668 15.6474 8.13752 15.673C8.24556 15.6771 8.33258 15.764 8.33726 15.8721C8.35581 16.3 8.41311 16.7133 8.50538 17.1107C8.51344 17.1454 8.48728 17.1788 8.45161 17.1789C7.59258 17.1789 6.76262 17.0669 5.98177 16.8582L3.68475 17.4968C3.45891 17.5596 3.21671 17.5132 3.03009 17.3713C2.84346 17.2295 2.73387 17.0086 2.73387 16.7742V15.211C1.22401 13.9648 0.25 12.2016 0.25 10.2145Z" fill="#000000"/>
    <g id="dots">
  <circle id="bubble1-dot1" cx="5.78" cy="8.2" r="1" fill="black"/>
  <circle id="bubble1-dot2" cx="11" cy="8.2" r="1" fill="black"/>
  <circle id="bubble2-dot1" cx="14.4" cy="14.2" r="1" fill="black"/>
  <circle id="bubble2-dot2" cx="19.62" cy="14.2" r="1" fill="black"/>
    </g>
  <path id="bubble1" d="M16.7856 9.85853C20.496 9.85853 23.7452 12.3912 23.7452 15.7873C23.7452 17.4662 22.9366 18.7319 21.6801 19.7881V21.0322C21.6801 21.2666 21.5705 21.4876 21.3839 21.6294C21.1972 21.7712 20.955 21.8176 20.7292 21.7548L18.8477 21.2318C18.1961 21.4029 17.5049 21.4945 16.7903 21.4945C13.0798 21.4945 9.83063 18.9619 9.83063 15.5658C9.83063 12.1697 13.0751 9.85853 16.7856 9.85853ZM22.25 15.5658C22.25 13.2416 19.9389 11.1371 16.7903 11.1371C13.6417 11.1371 11.3306 13.2416 11.3306 15.5658C11.3306 17.89 13.6417 19.9945 16.7903 19.9945C17.4405 19.9945 18.062 19.9021 18.6372 19.7337C18.7715 19.6943 18.9141 19.6934 19.0489 19.7308L20.1801 20.0453V19.4259C20.1801 19.1892 20.2918 18.9664 20.4815 18.8248C21.596 17.9929 22.25 16.8237 22.25 15.5658Z" fill="#000000"></path> </g></svg>
);

export const ChatIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="white" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);


export const JoinGroupIcon = ({ size = 24, color = "currentColor", ...props }) => (
 <svg 
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size} 
  viewBox="0 0 24 24" 
  fill="none"
  stroke={color} 
  strokeWidth="2" 
  strokeLinecap="round" 
  strokeLinejoin="round" 
  className="animated-icon">
  <defs>
    <mask id="p1-mask">
      <rect x="0" y="0" width="24" height="24" fill="white"/>
      <g fill="black">
        <circle cx="8" cy="8" r="2.5"/> <path d="M2.5 18 A 5 5.5 0 1 1 13.5 18 Z"/> </g>
    </mask>
  </defs>

  <style>
    {`
        /* 1. SETUP */
      .animated-icon {
        cursor: pointer;
      }
      
      /* Shared styles for people */
      .person-shape {
        fill: white; /* Needed to hide the person behind! */
        stroke: black;
        stroke-width: 0.5;
        transition: transform 0.3s;
      }

      /* 2. ANIMATIONS */
      
      /* DEFAULT: The "Step Back" Animation (Runs on Mouse Leave/Load) */
      #person2 {
        /* Start masked (behind) */
        mask: url(#p1-mask);
        animation: stepBack 0.6s ease-in-out forwards;
        transform-origin: center bottom;
      }

      /* HOVER: The "Step Around" Animation */
      .animated-icon:hover #person2 {
        animation: stepAround 0.6s ease-in-out forwards;
      }

      /* 3. KEYFRAMES */

      @keyframes stepAround {
        /* Start: Behind (Masked) */
        0% {
          transform: translateX(0);
          mask: url(#p1-mask);
        }
        /* Middle: Step to Right (Remove Mask) */
        50% {
          transform: translateX(6px) translateY(-1px);
          mask: none; /* Mask removed safely here */
        }
        /* End: Step Left/Front (Unmasked) */
        100% {
          transform: translateX(0px);
          mask: none;
        }
      }

      @keyframes stepBack {
        /* Start: In Front (Unmasked) */
        0% {
          transform: translateX(-1px);
          mask: none;
        }
        /* Middle: Step to Right */
        50% {
          transform: translateX(6px) translateY(-1px);
          mask: none;
        }
        /* End: Behind (Re-apply Mask) */
        100% {
          transform: translateX(0);
          mask: url(#p1-mask);
        }
      }
    `}
    
  </style>

  <g stroke="black" stroke-width="0.5">
    <rect x="16.25" y="5.25" width="4.5" height="0.5" rx="0.25" fill="black" stroke-width="0.2"/>
    <rect x="18.75" y="3.25" width="4.5" height="0.5" rx="0.25" transform="rotate(90 18.75 3.25)" fill="black" stroke-width="0.2"/>
  </g>

  <g id="person1" class="person-shape">
    <circle cx="8" cy="8" r="2.5"/>
    <path d="M2.5 18 A 5 5.5 0 1 1 13.5 18 Z"/>
  </g>

  <g id="person2" class="person-shape">
    <circle cx="13.5" cy="10.5" r="1.8"/>
    <path d="M10 18 A 3 3.5 0 1 1 17 18 Z"/>
  </g>
</svg>
);

export const LeaveGroupIcon = ({ size = 24, color = "currentColor", ...props }) => (
<svg 
  xmlns="http://www.w3.org/2000/svg"
  width={size} 
  height={size}
  viewBox="0 0 24 24"
  fill="none" 
  stroke={color} 
  strokeWidth="2" 
  strokeLinecap="round" 
  strokeLinejoin="round"
  {...props} 
>
  <path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4h3a2 2 0 0 1 2 2v1m-5 13h3a2 2 0 0 0 2-2v-1M4.425 19.428l6 1.8A2 2 0 0 0 13 19.312V4.688a2 2 0 0 0-2.575-1.916l-6 1.8A2 2 0 0 0 3 6.488v11.024a2 2 0 0 0 1.425 1.916zM9.001 12H9m7 0h5m0 0-2-2m2 2-2 2"/>
</svg>
);

export const ExplorePostsIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">

<style>
  {`
    #magnify-orbit {
      transform-box: fill-box;
      transform-origin: center;

      opacity: 0;
      transform: scale(0) rotate(0deg);

      transition:
        transform 0.8s cubic-bezier(.2, 1, .4, 1),
        opacity 0.3s ease-in-out;
    }

    svg:hover #magnify-orbit {
      opacity: 1;
      transform: scale(1) rotate(360deg);
    }
  `}
</style>

  <g id="post" transform="scale(0.6) translate(7 7)">
    <path d="M2 5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V5ZM5 4C4.44772 4 4 4.44772 4 5V10H20V5C20 4.44772 19.5523 4 19 4H5ZM4 12V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V12H4ZM14 13C14.2652 13 14.5196 13.1054 14.7071 13.2929L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L14 15.4142L11.7071 17.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L9.58579 17L9 16.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L8.29289 14.2929C8.48043 14.1054 8.73478 14 9 14C9.26522 14 9.51957 14.1054 9.70711 14.2929L11 15.5858L13.2929 13.2929C13.4804 13.1054 13.7348 13 14 13ZM11 7C11 6.44772 11.4477 6 12 6H17C17.5523 6 18 6.44772 18 7C18 7.55228 17.5523 8 17 8H12C11.4477 8 11 7.55228 11 7ZM7 8.75C7.9665 8.75 8.75 7.9665 8.75 7C8.75 6.0335 7.9665 5.25 7 5.25C6.0335 5.25 5.25 6.0335 5.25 7C5.25 7.9665 6.0335 8.75 7 8.75Z" fill="black"/>
  </g>

  <g id="magnify-orbit">
    <g id="magnify_glass" transform="scale(0.2) translate(0 0)" fill="black">
      <circle
    cx="55"
    cy="55"
    r="46"
    fill="rgba(120, 190, 255, 0.35)"
    filter="blur(0.2px)"
  />
      <path d="M109,55c0-29.8-24.2-54-54-54C25.2,1,1,25.2,1,55s24.2,54,54,54c13.5,0,25.8-5,35.2-13.1l25.4,25.4l5.7-5.7L95.9,90.2C104,80.8,109,68.5,109,55z M55,101C29.6,101,9,80.4,9,55S29.6,9,55,9s46,20.6,46,46S80.4,101,55,101z"/>
      <path d="M25.6,30.9l6.2,5.1C37.5,29,46,25,55,25v-8C43.6,17,32.9,22.1,25.6,30.9z"/>
      <path d="M17,55h8c0-2.1,0.2-4.1,0.6-6.1l-7.8-1.6C17.3,49.8,17,52.4,17,55z"/>
    </g>
  </g>

</svg>
);

export const CommentsIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    height={size} 
    width={size} 
    viewBox="0 0 24 24"
    stroke="black"
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
    >
    <g transform="scale(0.045 0.045) translate(10 0)">
      <g strokeWidth="10">
        <path fill="white" d="M92.574,294.24V124.336H43.277C19.449,124.336,0,144.213,0,168.467v206.44 c0,24.254,19.449,44.133,43.277,44.133h62v45.469c0,3.041,1.824,5.777,4.559,6.932c2.736,1.154,5.957,0.486,8.023-1.641 l49.844-50.76h106.494c23.828,0,43.279-19.879,43.279-44.133v-0.061H172.262C128.314,374.846,92.574,338.676,92.574,294.24z"/> 
        <path fill="white" d="M462.717,40H172.26c-27.105,0-49.283,22.59-49.283,50.197v204.037c0,27.61,22.178,50.199,49.283,50.199 h164.668l75.348,76.033c2.399,2.442,6.004,3.172,9.135,1.852c3.133-1.322,5.176-4.434,5.176-7.887v-69.998h36.131 c27.106,0,49.283-22.59,49.283-50.199V90.197C512,62.59,489.822,40,462.717,40z M369.156,280.115H195.92v-24.316h173.236V280.115z M439.058,204.129H195.92v-24.314h243.138V204.129z M439.058,128.143H195.92v-24.315h243.138V128.143z"/>
      </g> 
      <rect width="255" height="25" x="190" y="105" rx="20" ry="10" fill="black"/>
      <rect width="255" height="25" x="190" y="180" rx="20" ry="10" fill="black"/>
      <rect width="185" height="25" x="190" y="255" rx="20" ry="10" fill="black"/> 
    </g>
</svg>
);

//https://www.svgrepo.com/vectors