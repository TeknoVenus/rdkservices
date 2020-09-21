import { Utils } from 'wpe-lightning-sdk'

import Progress from "./Progress";

export default class AppTile extends lng.Component {
    static _template( )
    {
      var pts = 20;
      var barClr1  = 0xFF888888;  // #888888FF  // Background
      var frameClr = 0xFF666666;  // #666666FF
      var textClr  = 0xFFffffff;  // #ffffffFF

      var stroke    = 2;
      var strokeClr = 0xFF444444;

      let RR = { radius: 20, type: lng.shaders.RoundedRectangle, stroke: stroke, strokeColor: strokeClr}

      return {
        flexItem: { margin: 40 },
        alpha: 1.0,
        Button:
        {
          scale: 0.0,

          RRect:
          {
              w: 210, h: 150, rtt: true, rect: true, pivot: 0.5, alpha: 1.0, color: frameClr, shader: RR,

              Image: {
                mountX: 0.5,
                mountY: 0.5,
                src: Utils.asset('images/crate2_80x80.png'),
                x: (w => 0.45 * w),
                y: (h => 0.4 * h)
              },

              Label:
              { mountX: 0.5, mountY: 1.0, x: (w => 0.5 * w), y: (h => h - 5),
                text: {  text: "Label 11", fontFace: 'Regular', fontSize: pts, textColor: textClr,

                shadow: true,
                shadowColor: 0xFF000000,
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowBlur: 8,
                },
              },

              Icon: {
                alpha: 1.0,
                mountX: 1.0,
                scale: 0.52,
                x: (w => w + 4),
                y: (h => 0)
              },
            },

            Progress: { type: Progress, mountX: 0.0, x: 0, y: 190, w: 210, h: 8, alpha: 0.0 },
        }//Button
      }
    };

    setLabel(s)
    {
      var obj = this.tag("Label")
      obj.text.text = s;
    }

    setIcon(s)
    {
      var btn = this.tag("Button");
      var icn = btn.tag("Icon")

      icn.patch( {src: s } );
    }

    _focus()
    {
      var btn  = this.tag("Button");
      var tile =  btn.tag("RRect")

      // console.log("BUTTON: focus() >> pkgId: " + this._info.pkgId);

      tile.setSmooth('scale', 1.15, {duration: 0.3});
    }

    _unfocus()
    {
      var btn  = this.tag("Button");
      var tile =  btn.tag("RRect")

      // console.log("BUTTON: unfocus() >> pkgId: " + this._info.pkgId);

      tile.setSmooth('scale', 1.0, {duration: 0.3});
    }

    hide()
    {
      if(this.tag("Button").scale == 1.0)
      {
        const anim = this.tag('Button').animation({
          duration: 0.5,
          actions: [
              { p: 'scale', v: { 0: 1, 0.5: 0.50, 1: 0.0 } },
          ]
        });
        anim.start();
      }
    }

    show(d = 0)
    {
      if(this.tag("Button").scale == 0.0)
      {
        const anim = this.tag('Button').animation({
          duration: 0.5,
          delay: d,
          actions: [
              { p: 'scale', v: { 0: 0, 0.5: 0.50, 1: 1.0 } },
          ]
        });
        anim.start();
      }
    }

    _init()
    {
      this._enabled = true;
      this.tag("Button").scale = 0;

      if(this.w && this.h)
      {
        let button = this.tag("Button");

        button.w = this.w;
        button.h = this.h;
      }

      this.info = this.tileInfo;
    }

    set info( ii )
    {
      this.setInfo(ii);  // allow set 'null'
    }

    get info()
    {
      return this._info;
    }

    setInfo(ii)
    {
      var check_mark_PNG = Utils.asset('images/check_mark.png');
      var download_PNG   = Utils.asset('images/download3.png');

      if(ii)
      {
        if(ii.id)
        {
          ii.pkgId = ii.id;
        }

        if(ii.name)  this.setLabel(ii.name)
        else
        if(ii.label) this.setLabel(ii.label)
        else
        if(ii.id)    this.setLabel(ii.id)
        else
        if(ii.pkgId) this.setLabel(ii.pkgId)
        else         this.setLabel("unknown22")

        var icon = (ii.pkgInstalled) ? check_mark_PNG : download_PNG;
        this.setIcon(icon);
      }
      else
      {
        this.setIcon(download_PNG);
      }

      this._info = ii // allow 'null'
    }

    isEnabled()
    {
      return this._enabled;
    }

    enable()
    {
      //console.log("APP TILE  >> enable() - " + this.info.pkgId)

      this.tag("Button").setSmooth('alpha', 1.0, {duration: 0.3});
      this._enabled = true;
    }

    disable()
    {
      //console.log("APP TILE  >> disable() - " + this.info.pkgId)

      this.tag("Button").setSmooth('alpha', 0.5, {duration: 0.3});
      this._enabled = false;
    }

    startWiggle()
    {
        this.wiggleAnim = this.tag('Image').animation({
            duration: 0.11*3,
            repeat: -1,
            actions: [
              {
                t: '',
                repeat: -1,
                p: 'rotation', v: { 0: 0.0, 0.25: -0.14, 0.5: 0.0, 0.75: 0.14, 1: 0.0},
              },
            ],
          });

        this.wiggleAnim.start()
    }

    stopWiggle()
    {
      this.wiggleAnim.stop();
      this.wiggleAnim = null;
    }

    setInstalled(v)
    {
      if(this._info)
      {
        this._info.pkgInstalled = v;
      }
    }

    isInstalled()
    {
      return this._info.pkgInstalled;
    }

    clickAnim()
    {
      var anim = this.tag('Button').animation({
        duration: 0.35,
        repeat: 1,
        actions: [
          {
            t: '',
            p: 'scale', v: { 0: 1.0, 0.5: 1.2, 1: 1.0},
          },
        ],
      });

      anim.start()
    }

  }//CLASS
