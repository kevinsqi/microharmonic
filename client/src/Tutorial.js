import React from 'react';

import Keyboard from './Keyboard';

function Tutorial(props) {
  // TODO: swap in photos with own illustrations
  // TODO: show weird physical microtone keyboards
  return (
    <div className="container my5">
      <div className="row">
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
          <h1 className="text-muted">01. An introduction to microtones</h1>
          <div className="row py-3">
            <div className="col-12 col-md-10 offset-md-1">
              <img
                className="w-100"
                src="http://www.agnes-bruckner.com/apronus_images/facepiano.gif"
                alt="piano keyboard"
              />
            </div>
          </div>
          <p>
            C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, and B.
            From these 12 notes we can play pretty much any song that we know of in modern music.
            The approach of dividing an octave equally is known as "equal temperament".
            You can try it out with a 12EDO keyboard here.
          </p>
          <div>
            <Keyboard
              config={{
                useCustomCentValues: false,
                minFrequency: 220,
                numOctaves: 1,
                numSteps: 12,
                selectedNotes: {},
              }}
              gain={props.gain}
              bindEvents={false}
            />
          </div>
          <p className="mt-3">
            This 12 tone scale originates back to 1584, when Zhu Zaiyu
            developed the mathematical basis for dividing the octave equally into 12 parts.

            Zhu Zaiyu was a prince of the Ming court in China, and spent thirty years
            researching equal temperament.

            He demonstrated this 12 note division by constructing a set of bamboo pipes
            over three octaves, and increasing the length of the each pipe by a factor of
            the twelfth root of 2.
          </p>
          <div className="row py-3">
            <div className="col-md-6 offset-md-3">
              <img
                className="w-100"
                src="https://upload.wikimedia.org/wikipedia/commons/f/f2/%E4%B9%90%E5%BE%8B%E5%85%A8%E4%B9%A6%E5%85%A8-1154.jpg"
                alt="bamboo pipes"
              />
            </div>
          </div>
          <p>
            The "distance", or "interval", between any two notes is the same in 12EDO.
          </p>
          <p>
            But you can make many more sounds than just these 12 notes.
            Just use your voice to hum from C to D and you’ve produced a
            continuous spectrum of frequencies that aren't in 12EDO.
            And it’s not just voice. Here are some other instruments that can
            traverse between notes:
          </p>
          <div className="row my-3">
            <div className="col-12 text-center">
              <img
                height="150"
                src="https://static1.squarespace.com/static/57d2f09a6b8f5b98b30057f4/t/58cb1879414fb534eec71f43/1492026344786/"
                alt="trombone"
              />
              <img
                height="150"
                src="https://images-na.ssl-images-amazon.com/images/I/61NJglqoJVL._SL1500_.jpg"
                alt="otomatone"
              />
              <img
                height="150"
                src="http://media.guitarcenter.com/is/image/MMGS7/Prelude-Series-Violin-Outfit-1-8-Size/J05662000001000-00-500x500.jpg"
                alt="violin"
              />
            </div>
          </div>
          <p>
            Microtones refer to the use of intervals that don’t fit within this
            ubiquitous 12 tone structure.
            Listen to this microtonal song:
          </p>
          <div>
            <iframe
              title="soundcloud_the_juggler"
              width="100%"
              height="150"
              scrolling="no"
              frameBorder="no"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/146753233&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true&amp;visual=true"
            />
          </div>
          <p>
            The composer notes that this was written in 19EDO.
            You can play around with 19EDO here.
            {/* TODO: use Composer to actually transcribe The Juggler */}
          </p>
          <div>
            <Keyboard
              config={{
                useCustomCentValues: false,
                minFrequency: 220,
                numOctaves: 1,
                numSteps: 19,
                selectedNotes: {},
              }}
              gain={props.gain}
              bindEvents={false}
            />
          </div>
          <p>
            Microtonal music can also sound quite strange and wonderful.
            This song by Sevish uses a 53EDO scale:
          </p>
          <div>
            <iframe
              title="soundcloud_sevish_droplet"
              width="100%"
              height="150"
              scrolling="no"
              frameBorder="no"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/212652160&amp;color=%23b89890&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true&amp;visual=true"
            />
          </div>
          <h2 className="h4 font-weight-bold mt4">Frequencies and cents</h2>
          <p>
            Our perception of sound is on a logarithmic scale relative to frequency. An octave, from C to C or D to D or so on, is when you double the frequency.
            Middle C is 440hz. Go up an octave to 880hz.
            Being logarithmic isn’t super convenient relative to our perception, which is linear. So we can use cents instead, which is defined as:
          </p>
          <div>
            <iframe
              title="binky_doesnt_understand"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/taCNT81k1v8?rel=0"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
