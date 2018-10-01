import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

 class Album extends Component {
  constructor(props) {
  super(props); 
  
  const album = albumData.find( album => {
    return album.slug === this.props.match.params.slug
  });

  this.state = {
    album: album,
    currentSong: album.songs[0],
    currentTime: 0,
    duration: album.songs[0].duration,
    currentVolume: 0,
    isPlaying: false
  };

  this.audioElement = document.createElement('audio');
  this.audioElement.src = album.songs[0].audioSrc;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {this.setState({currentTime: this.audioElement.currentTime});
  },
      durationchange: e => {this.setState({duration: this.audioElement.duration});
    },
     volumechange: e => {this.setState({currentVolume: this.audioElement.volume});
    }
  };

  this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
  this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
}

componentWillUnmount() {
     this.audioElement.src = null;
     this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
     this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
   }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({currentSong: song});
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

   handleSongClick(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
       this.pause();
     } else {
       if (!isSameSong) { this.setSong(song); }     
       this.play();
     }
   }

   setSongClass(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
       return 'ion-md-pause';
     } else {
       if (!isSameSong) {    
       return 'ion-md-play';
     } 
      return 'ion-md-play';
     
   }}

   setIndexClass(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
       return 'hide';
     } else {
       if (!isSameSong) {    
       return 'show';
     }
     }
     return 'show';
   }

   handlePrevClick() {
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.max(0, currentIndex - 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
   }

   handleNextClick() {
    const currentIndex =  this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex + 1);
    if (newIndex === 5) {
      return 1;
    };
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
   }

   handleTimeChange(e) {
      e.preventDefault();
      const newTime = this.audioElement.duration * e.target.value;
      this.audioElement.currentTime = newTime;
      this.setState({currentTime: newTime}); 
   }

   handleVolumeChange(e) {
      e.preventDefault();
      const newVolume = e.target.value;
      this.audioElement.volume = newVolume;
      this.setState({currentVolume: this.audioElement.volume});
   }

   formatTime(time) {
      const seconds = parseInt(time, 10);
      const hours   = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds - (hours * 3600)) / 60);
      const newSeconds =  seconds - (hours * 3600) - (minutes * 60);
      if (seconds === 0) {
        return "-:--"
      } else {
        return (hours + ":" + minutes + ":" + newSeconds)
      }
    }

   render() {
     return (
       <section className="album">
         <section id="album-info">
           <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
           <div className="album-details">
             <h1 id="album-title">{this.state.album.title}</h1>
             <h2 className="artist">{this.state.album.artist}</h2>
             <div id="release-info">{this.state.album.year} {this.state.album.label}</div>
           </div>
         </section>
          <table id="song-list">
           <colgroup>
            <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>
           <tbody>{this.state.album.songs.map((song,index)=><tr className='song'key={index}onClick={()=>this.handleSongClick(song)}><td className={this.setSongClass(song)}></td><td className={this.setIndexClass(song)}>{index+1}</td><td>{song.title}{song.duration}seconds</td></tr>)}
          </tbody>
         
         </table>
         <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          currentVolume={this.audioElement.volume}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          formatTime={(time) => this.formatTime(time)}
          />
         </section>
     );
   }
 }

export default Album;