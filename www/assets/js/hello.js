/**
 * Created by jingweirong on 16/3/13.
 */
var React = require("react");
class Hello extends React.Component{
    render() {
        return (
            <h1>hello {this.props.name}</h1>
        );
    }
}