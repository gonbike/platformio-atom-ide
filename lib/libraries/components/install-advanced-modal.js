/** @babel */
/** @jsx jsxDOM */

/**
 * Copyright 2016-present PlatformIO Plus <contact@pioplus.com>
 *
 * License: https://pioplus.com/license.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

import { BaseModal, BaseView, jsxDOM } from '../../view';
import { CompositeDisposable, TextEditor } from 'atom';


export default class LibInstallAdvancedModal extends BaseModal {

  constructor() {
    super(...arguments);
    this._view = null;
  }

  get view() {
    if (!this._view) {
      this._view =  new LibInstallAdvancedView({
        onresolve: (value) => this.resolve(value),
        onreject: (reason) => this.reject(reason)
      });
    }
    return this._view;
  }

  onDidOpen() {
    this.view.focus();
  }

}

class LibInstallAdvancedView extends BaseView {

  constructor() {
    super(...arguments);

    this.disposables = new CompositeDisposable();
    this.disposables.add(atom.commands.add(
      this.refs.libEditor.element,
      'core:confirm',
      ::this.onDidSubmit
    ));
    this.disposables.add(atom.commands.add(
      this.refs.libEditor.element, 'core:cancel',
      ::this.onDidCancel
    ));
  }

  onDidSubmit() {
    const platform = this.refs.libEditor.getText().trim();
    if (!platform) {
      this.focus();
      return;
    }
    this.props.onresolve(this.refs.libEditor.getText().trim());
  }

  onDidCancel() {
    this.props.onreject(null);
  }

  focus() {
    this.refs.libEditor.element.focus();
  }

  destroy() {
    this.disposables.dispose();
    super.destroy();
  }

  render() {
    return (
      <div>
        <h1>Advanced library installation</h1>
        <TextEditor ref='libEditor' mini={ true } placeholderText='Library id, name, repository, requirements...' />

        <ul className='block'>
          <li><kbd>&lt;id&gt;</kbd> - 12345</li>
          <li><kbd>id=&lt;id&gt;</kbd> - id=12345</li>
          <li><kbd>&lt;id&gt;@&lt;version&gt;</kbd> - 12345@1.2.3 or 12345@^1.2.3 (<a href='http://semver.org/'>Semantic Versioning</a>)</li>
          <li><kbd>&lt;id&gt;@&lt;version range&gt;</kbd> - 12345@>0.1.0,!=0.2.0,&lt;0.3.0</li>
          <li><kbd>&lt;name&gt;</kbd> - Foo</li>
          <li><kbd>&lt;name&gt;@&lt;version&gt;</kbd> - Foo@1.2.3 or Foo@~1.2.3</li>
          <li><kbd>&lt;name&gt;@&lt;version range&gt;</kbd>  - Foo@!=1.2.0</li>
          <li><kbd>&lt;zip or tarball url&gt;</kbd></li>
          <li><kbd>file://&lt;zip or tarball file&gt;</kbd></li>
          <li><kbd>file://&lt;folder&gt;</kbd></li>
          <li><kbd>&lt;repository&gt;</kbd></li>
          <li><kbd>&lt;name&gt;=&lt;repository&gt;</kbd> (name it should have locally)</li>
          <li><kbd>&lt;repository#tag&gt;</kbd> ("tag" can be commit, branch or tag)</li>
          <li><a href='http://docs.platformio.org/page/userguide/lib/cmd_install.html'>more (docs)...</a></li>
        </ul>

        <div className="block inset-panel padded">
          <p>
            <span className='icon icon-info'></span> PlatformIO Core has built-in powerful <a href='http://docs.platformio.org/page/librarymanager/index.html'>Library Manager</a>      that allows you to specify dependencies for specific project in <a href='http://docs.platformio.org/page/projectconf.html'>Project Configuration File "platformio.ini"</a>      using <kbd>lib_deps</kbd> option.
          </p>
          The dependent libraries will be installed automatically on the first build of a project.   No need to install them manually.
        </div>

        <div className='block text-right'>
          <button onclick={ ::this.onDidCancel } className='inline-block btn btn-lg'>Cancel</button>
          <button onclick={ ::this.onDidSubmit } className='inline-block btn btn-lg btn-primary'>Install to...</button>
        </div>
      </div>
    );
  }

}