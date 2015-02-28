var uniq = require('uniq');
var extend = require('extend');

var EmoticonBox = React.createClass({

  loadDataFromServer() {
    fetch(this.props.dataSource)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.setState({data: json.list});
      })
      .catch((error) => {
        console.log('request failed', error)
      });
  },

  componentDidMount() {
    this.loadDataFromServer();
  },

  getInitialState() {
    return {searchText: '', data: []};
  },

  handleSearch() {
    this.setState({
      searchText: this.refs.searchBox.getDOMNode().value
    });
  },

  render() {
    var emoticons = [];
    var searchText = this.state.searchText.trim();
    this.state.data.forEach(function(group) {
      if (!searchText || group.tag.split(' ').indexOf(searchText) >= 0) {
        emoticons.push(...group.yan);
      }
    });
    return (
      <div className="emoticon-box">
        <input type="text" className="search-box" ref="searchBox" placeholder="关键词搜索，如: 掀桌" onChange={this.handleSearch} value={this.state.searchText} />
        <EmoticonList emoticons={uniq(emoticons)} onSelect={this.props.onSelect} />
      </div>
    );
  }

});

var EmoticonList = React.createClass({

  handleSelect(event) {
    var text = event.target.textContent || event.target.innerText;
    this.props.onSelect(text);
  },

  render() {
    var emoticonNodes = this.props.emoticons.map((emoticon) => {
      return (
        <li className="emoticon" onClick={this.handleSelect} key={emoticon}>
          {emoticon}
        </li>
      );
    });
    return (
      <ul className="emoticon-list">
        {emoticonNodes}
      </ul>
    );
  }

});

var Yan = {

  init: function(target, opts) {
    opts = extend({
      dataSource: 'https://cdn.rawgit.com/turingou/o3o/master/yan.json',
      onSelect: function() {},
      closeOnSelect: true
    }, opts);

    var drop = null;

    var originalOnSelect = opts.onSelect;
    opts.onSelect = function(o) {
      if (drop && opts.closeOnSelect) {
        drop.close();
      }
      originalOnSelect(o);
    };

    var elem = document.createElement('div');
    React.render(<EmoticonBox {...opts} />, elem);

    drop = new Drop({
      target: target,
      classes: 'drop-theme-arrows-bounce',
      content: elem,
      position: 'top center',
      constrainToWindow: true,
      openOn: 'click'
    });
  }

};

module.exports = Yan;
