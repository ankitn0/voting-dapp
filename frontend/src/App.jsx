import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contract';
import './index.css';

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const [poll, setPoll] = useState(null);
  const [creating, setCreating] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // at least 2 options
  const [isOwner, setIsOwner] = useState(false);
  const [status, setStatus] = useState('');

  // Initialize provider on load
  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.providers.Web3Provider(window.ethereum, 'any');
      setProvider(p);

      // Optional: auto-connect if already authorized
      window.ethereum.request({ method: 'eth_accounts' }).then(async (accounts) => {
        if (accounts.length > 0) {
          await connectWallet(p);
        }
      });

      // Handle account changes
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setSigner(null);
          setContract(null);
          setIsOwner(false);
          setPoll(null);
        } else {
          await connectWallet(p);
        }
      });
    }
  }, []);

  async function connectWallet(pOverride) {
    const p = pOverride || provider;
    if (!p) {
      alert('Please install MetaMask');
      return;
    }

    try {
      await p.send('eth_requestAccounts', []);
      const s = p.getSigner();
      const a = await s.getAddress();

      setSigner(s);
      setAccount(a);

      const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, s);
      setContract(c);

      // Check owner
      try {
        const ownerAddr = await c.owner();
        setIsOwner(ownerAddr.toLowerCase() === a.toLowerCase());
      } catch (err) {
        console.error('Error fetching owner:', err);
      }

      await fetchPoll(c);
    } catch (err) {
      console.error('connectWallet error:', err);
      alert('Failed to connect wallet');
    }
  }

  async function fetchPoll(cInstance) {
    const c = cInstance || contract;
    if (!c) return;

    try {
      const res = await c.getActivePoll();
      // res = [pollId, question, options, votes, isActive]
      const pollId = res[0];
      const question = res[1];
      const opts = res[2];
      const votesBN = res[3];
      const isActive = res[4];

      // If no poll yet (pollId == 0)
      if (pollId.toNumber() === 0) {
        setPoll(null);
        return;
      }

      const votes = votesBN.map((v) => v.toNumber());
      setPoll({
        id: pollId.toNumber(),
        question,
        options: opts,
        votes,
        isActive,
      });
    } catch (err) {
      console.error('fetchPoll error:', err);
      setPoll(null);
    }
  }

  function updateOption(idx, val) {
    const copy = [...options];
    copy[idx] = val;
    setOptions(copy);
  }

  function addOption() {
    if (options.length >= 5) return; // max 5 options
    setOptions([...options, '']);
  }

  async function submitCreate(e) {
    e.preventDefault();
    if (!contract) return alert('Connect wallet first');
    if (!isOwner) return alert('Only owner can create poll');

    const trimmedOpts = options.map((o) => o.trim()).filter((o) => o.length > 0);

    if (question.trim() === '' || trimmedOpts.length < 2) {
      return alert('Provide a question and at least 2 options');
    }

    setCreating(true);
    setStatus('Creating poll...');
    try {
      const tx = await contract.createPoll(question, trimmedOpts);
      await tx.wait();
      setStatus('Poll created successfully');
      setQuestion('');
      setOptions(['', '']);
      await fetchPoll(contract);
    } catch (err) {
      console.error('submitCreate error:', err);
      alert('Create poll failed');
      setStatus('Create poll failed');
    } finally {
      setCreating(false);
    }
  }

  async function castVote(i) {
    if (!contract) return alert('Connect wallet first');
    if (!poll || !poll.isActive) return alert('Poll is not active');

    setStatus('Submitting vote...');
    try {
      const tx = await contract.vote(i);
      await tx.wait();
      setStatus('Vote submitted');
      await fetchPoll(contract);
    } catch (err) {
      console.error('castVote error:', err);
      alert(err?.data?.message || err.message || 'Vote failed');
      setStatus('Vote failed');
    }
  }

  async function endPoll() {
    if (!contract) return alert('Connect wallet first');
    if (!isOwner) return alert('Only owner can end poll');
    if (!poll || !poll.isActive) return alert('Poll is already ended');

    setStatus('Ending poll...');
    try {
      const tx = await contract.endPoll();
      await tx.wait();
      setStatus('Poll ended');
      await fetchPoll(contract);
    } catch (err) {
      console.error('endPoll error:', err);
      alert('End poll failed');
      setStatus('End poll failed');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Voting dApp</h1>

        {/* Wallet / account */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => connectWallet()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {account
              ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
              : 'Connect Wallet'}
          </button>
          {account && (
            <span className="text-xs text-gray-500">
              {isOwner ? 'Role: Owner' : 'Role: Voter'}
            </span>
          )}
        </div>

        {status && (
          <div className="mb-4 text-xs text-gray-600 bg-gray-100 p-2 rounded">
            {status}
          </div>
        )}

        {/* Create Poll (Owner Only) */}
        {isOwner && (
          <section className="mb-6">
            <h2 className="font-semibold">Create Poll (owner only)</h2>
            <form onSubmit={submitCreate} className="space-y-2 mt-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Question"
                className="w-full border p-2 rounded"
              />
              {options.map((opt, i) => (
                <input
                  key={i}
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="w-full border p-2 rounded"
                />
              ))}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addOption}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Add option
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-60"
                >
                  {creating ? 'Creating...' : 'Create Poll'}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Active Poll Section */}
        <section>
          <h2 className="font-semibold">Active Poll</h2>
          {!poll && <p className="text-sm text-gray-500 mt-1">No active poll</p>}
          {poll && (
            <div className="mt-2">
              <div className="mb-3">
                <strong>{poll.question}</strong>
                <div className="text-xs text-gray-500">
                  Status: {poll.isActive ? 'Active' : 'Ended'} | ID: {poll.id}
                </div>
              </div>

              <div className="grid gap-2">
                {poll.options.map((o, i) => (
                  <button
                    key={i}
                    onClick={() => castVote(i)}
                    disabled={!poll.isActive}
                    className="text-left p-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-60"
                  >
                    <div className="flex justify-between">
                      <div>{o}</div>
                      <div className="text-sm text-gray-500">
                        Votes: {poll.votes[i]}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {isOwner && poll.isActive && (
                <div className="mt-3">
                  <button
                    onClick={endPoll}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    End Poll
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
