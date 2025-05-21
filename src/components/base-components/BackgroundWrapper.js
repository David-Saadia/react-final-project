import {useEffect} from "react";

/**
 * BackgroundWrapper component is a wrapper for a page or section that allows
 * the specification of a background image, with options for the image's
 * position, size, repeat, and attachment. It also allows for a title to be
 * set for the page, and a transition effect to be specified. Additionally,
 * any style or class names can be passed in to further customize the
 * component.
 * 
 * @param {string} [backgroundImage] - The URL of the image to be used as the background.
 * @param {string} [backgroundPosition='top center'] - The position of the image in the background.
 * @param {string} [backgroundSize='cover'] - The size of the image in the background.
 * @param {string} [backgroundRepeat='no-repeat'] - The repeat behavior of the image in the background.
 * @param {string} [backgroundAttachment] - The attachment of the image in the background.
 * @param {string} [title] - The title of the page.
 * @param {string} [transition=''] - The transition effect for the component.
 * @param {object} [style={}] - Any additional styles to be applied to the component.
 * @param {string} [className=''] - Any additional class names to be applied to the component.
 * @param {*} [children] - The children of the component.
 */
const BackgroundWrapper = ({
    //Parameters

    //Background image specification defaults
    backgroundImage,
    backgroundPosition = 'top center',
    backgroundSize = 'cover',
    backgroundRepeat = 'no-repeat',
    backgroundAttachment,
    //Additional page specifications 
    title,
    transition = '',
    style = {},
    className = '',

    children,}) => 
    {
        const PageBackgroundLayout = {
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition,
            backgroundSize,
            backgroundRepeat,
            backgroundAttachment,
            transition,
            minHeight: '100vh',
            margin: 0,
            padding: 0,
            ...style,
        };
        
        useEffect( () => {
            if(title) document.title = title
        }, [title]);

        return (
            <div className={className} style={PageBackgroundLayout}>
                {children}
            </div>
        );

    }

    export default BackgroundWrapper;
