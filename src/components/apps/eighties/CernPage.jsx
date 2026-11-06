import React, { useState } from 'react';
import { soundManager } from '../../../utils/audio';

export default function CernPage() {
  const [activeSection, setActiveSection] = useState('summary'); // summary, hypertext, tech, servers, people

  const handleLinkClick = (e, section) => {
    e.preventDefault();
    soundManager.playClick();
    setActiveSection(section);
  };

  return (
    <div className="bg-white text-black p-6 font-serif text-sm leading-relaxed max-w-3xl mx-auto shadow-lg border border-gray-300 select-text">
      {/* NeXT W3 Top Navigation Breadcrumb */}
      <div className="border-b border-gray-400 pb-2 mb-4 font-sans text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700">W3 / CERN 1989-1991 ARCHIVE</span>
          <span className="text-gray-400">|</span>
          <span className="font-mono text-gray-600">http://info.cern.ch/hypertext/WWW/</span>
        </div>
        <div className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-300 font-mono text-[10px] font-bold">
          [NeXTcube Server: DO NOT POWER DOWN]
        </div>
      </div>

      {/* Main Document Header */}
      <h1 className="text-3xl font-bold tracking-tight mb-2 font-serif text-black">
        World Wide Web
      </h1>
      <p className="text-xs font-sans text-gray-600 italic mb-4">
        The WorldWideWeb (W3) is a wide-area hypermedia information retrieval initiative aiming to give universal access to a large universe of documents.
      </p>

      {/* Navigation Sub-Links Bar */}
      <div className="bg-gray-100 p-2 mb-4 text-xs font-sans border border-gray-300 flex flex-wrap gap-3">
        <a
          href="#summary"
          onClick={(e) => handleLinkClick(e, 'summary')}
          className={`hover:underline font-bold ${activeSection === 'summary' ? 'text-black underline' : 'text-emerald-700'}`}
        >
          Overview
        </a>
        <a
          href="#hypertext"
          onClick={(e) => handleLinkClick(e, 'hypertext')}
          className={`hover:underline font-bold ${activeSection === 'hypertext' ? 'text-black underline' : 'text-emerald-700'}`}
        >
          What is HyperText?
        </a>
        <a
          href="#tech"
          onClick={(e) => handleLinkClick(e, 'tech')}
          className={`hover:underline font-bold ${activeSection === 'tech' ? 'text-black underline' : 'text-emerald-700'}`}
        >
          Technical Architecture
        </a>
        <a
          href="#servers"
          onClick={(e) => handleLinkClick(e, 'servers')}
          className={`hover:underline font-bold ${activeSection === 'servers' ? 'text-black underline' : 'text-emerald-700'}`}
        >
          W3 Servers (SLAC, CERN, DESY)
        </a>
        <a
          href="#people"
          onClick={(e) => handleLinkClick(e, 'people')}
          className={`hover:underline font-bold ${activeSection === 'people' ? 'text-black underline' : 'text-emerald-700'}`}
        >
          People & History
        </a>
      </div>

      {/* SECTION 1: EXECUTIVE SUMMARY */}
      {activeSection === 'summary' && (
        <div className="space-y-4">
          <p>
            Everything there is online about W3 is linked directly or indirectly to this document, including an <a href="#tech" onClick={(e) => handleLinkClick(e, 'tech')} className="text-emerald-700 hover:underline font-bold">executive summary</a> of the project, Mailing lists, Policy, November's W3 news, Frequently Asked Questions.
          </p>

          <h2 className="text-xl font-bold font-serif pt-2 border-b border-gray-300">
            What's out there?
          </h2>
          <p>
            Pointers to the world's online information, subjects, W3 servers, etc.
          </p>

          <h2 className="text-xl font-bold font-serif pt-2 border-b border-gray-300">
            Help
          </h2>
          <p>
            on the browser you are using. Line Mode Browser for terminals, or the NeXTStep browser/editor written in Objective-C.
          </p>

          <h2 className="text-xl font-bold font-serif pt-2 border-b border-gray-300">
            Software Products
          </h2>
          <p>
            A list of W3 project components (Line Mode Browser, NeXTStep browser/editor, CERN HTTPd daemon server, Library of Common Code).
          </p>

          <div className="bg-yellow-50 p-3 border-l-4 border-yellow-500 font-sans text-xs text-gray-800 space-y-1">
            <strong>Historical Note (March 1989):</strong>
            <p>
              Tim Berners-Lee submitted "Information Management: A Proposal" to his supervisor Mike Sendall at CERN. Sendall famously wrote on the cover: <em>"Vague but exciting..."</em>, granting permission to purchase a NeXT workstation.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 2: WHAT IS HYPERTEXT? */}
      {activeSection === 'hypertext' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif">What is HyperText?</h2>
          <p>
            HyperText is text which contains links to other texts. The term was coined by Ted Nelson around 1965.
          </p>
          <p>
            Hypermedia is a term used for hypertext which is not constrained to be text: it can include graphics, video and sound.
          </p>
          <p>
            The reader may choose to follow a link to learn more about a highlighted concept, creating a non-linear reading pathway across global computer networks.
          </p>
          <button
            type="button"
            onClick={(e) => handleLinkClick(e, 'summary')}
            className="text-emerald-700 font-sans text-xs font-bold hover:underline"
          >
            &larr; Return to World Wide Web overview
          </button>
        </div>
      )}

      {/* SECTION 3: TECHNICAL ARCHITECTURE */}
      {activeSection === 'tech' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif">Technical Details</h2>
          <p>
            The World Wide Web architecture rests on three fundamental pillars designed at CERN:
          </p>
          <ol className="list-decimal list-inside space-y-2 font-sans text-xs">
            <li>
              <strong>URI (Universal Resource Identifier):</strong> A uniform global syntax for addressing information assets (e.g., <code>http://info.cern.ch/hypertext/WWW/</code>).
            </li>
            <li>
              <strong>HTTP (HyperText Transfer Protocol):</strong> A lightweight, stateless client-server protocol running on TCP port 80 for transmitting hypermedia documents.
            </li>
            <li>
              <strong>HTML (HyperText Markup Language):</strong> A structured document representation based on SGML, defining headings, paragraphs, and anchor tags (<code>&lt;a href="..."&gt;</code>).
            </li>
          </ol>
          <button
            type="button"
            onClick={(e) => handleLinkClick(e, 'summary')}
            className="text-emerald-700 font-sans text-xs font-bold hover:underline"
          >
            &larr; Return to World Wide Web overview
          </button>
        </div>
      )}

      {/* SECTION 4: SERVERS DIRECTORY */}
      {activeSection === 'servers' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif">Early World Wide Web Servers</h2>
          <p className="font-sans text-xs text-gray-700">
            The earliest nodes that joined the global W3 project in 1991:
          </p>
          <ul className="list-disc list-inside space-y-2 font-mono text-xs">
            <li>
              <strong>info.cern.ch (CERN, Switzerland):</strong> First web server in the world, running on a NeXTcube.
            </li>
            <li>
              <strong>slacvm.slac.stanford.edu (SLAC, USA):</strong> Stanford Linear Accelerator Center, the first web server outside Europe (December 1991).
            </li>
            <li>
              <strong>desy.de (DESY, Germany):</strong> Deutsches Elektronen-Synchrotron physics institute.
            </li>
            <li>
              <strong>ncsa.uiuc.edu (NCSA, Illinois):</strong> National Center for Supercomputing Applications, home of the upcoming NCSA Mosaic browser.
            </li>
          </ul>
          <button
            type="button"
            onClick={(e) => handleLinkClick(e, 'summary')}
            className="text-emerald-700 font-sans text-xs font-bold hover:underline"
          >
            &larr; Return to World Wide Web overview
          </button>
        </div>
      )}

      {/* SECTION 5: PEOPLE */}
      {activeSection === 'people' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif">People of the W3 Project</h2>
          <div className="space-y-3 font-sans text-xs">
            <div className="p-2 border border-gray-200 bg-gray-50">
              <strong>Tim Berners-Lee:</strong> Project leader, creator of the World Wide Web, HTML, HTTP, and the first client/editor.
            </div>
            <div className="p-2 border border-gray-200 bg-gray-50">
              <strong>Robert Cailliau:</strong> Co-author of the 1990 proposal and key advocate for placing the web into the public domain royalty-free.
            </div>
            <div className="p-2 border border-gray-200 bg-gray-50">
              <strong>Nicola Pellow:</strong> Author of the Line Mode Browser, which allowed any terminal (VT100, dumb terminal) to access the web.
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => handleLinkClick(e, 'summary')}
            className="text-emerald-700 font-sans text-xs font-bold hover:underline"
          >
            &larr; Return to World Wide Web overview
          </button>
        </div>
      )}

      {/* Footer attribution */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-xs font-sans text-gray-500 flex justify-between">
        <span>CERN &bull; European Organization for Nuclear Research</span>
        <span>Geneva, Switzerland &bull; 1989-1991</span>
      </div>
    </div>
  );
}
