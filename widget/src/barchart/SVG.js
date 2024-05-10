import React from 'react';
import PropTypes from 'prop-types';
// Add check for children types, only a limited subset of SVG shapes that it can take
// Sketch SVG to react?
// Path
// Animation
export default class SVG extends React.Component {
    static propTypes = {
        // Aria Required Properties
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,

        // Sizing
        minx: PropTypes.string,
        miny: PropTypes.string,
        width: PropTypes.string.isRequired,
        height: PropTypes.string.isRequired
    }

    render() {
        const { minx, miny, width, height } = this.props;

        return (
            <svg {...this.props}
                 aria-labelledby="title desc"
                 role="img"
                 preserveAspectRatio="xMidYMid meet"
                 viewBox={`${minx} ${miny} ${width} ${height}`}>
                <title id="title">{this.props.title}</title>
                <desc id="desc">{this.props.description}</desc>
                {this.props.children}
            </svg>
        );
    }
}

SVG.defaultProps = {
    minx: '0',
    miny: '0'
}