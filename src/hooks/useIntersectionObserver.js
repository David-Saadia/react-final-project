import { useEffect } from 'react';

export const useIntersectionObserver = ({
    startRef, 
    endRef, 
    onTopIntersect, 
    onBottomIntersect, 
    options = {}
}) => {
    
    useEffect(() => {
        
        const observer = new IntersectionObserver((subscribers) => {
            subscribers.forEach((element) => {
                if (element.target === startRef.current) {
                    onTopIntersect(element.isIntersecting);
                }
                if (element.target === endRef.current) {
                    onBottomIntersect(element.isIntersecting);
                }
            });
        }, options);

        if (startRef.current) observer.observe(startRef.current);
        if (endRef.current) observer.observe(endRef.current);

        return () => observer.disconnect();
    }, [startRef, endRef, onTopIntersect, onBottomIntersect ,options]);
};