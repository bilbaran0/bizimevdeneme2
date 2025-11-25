import React, { useState, useMemo, useEffect } from 'react';
import { Tab, User, Task, Reward, FeedItem, Notification, Channel, VerificationStatus, TimeRange, Comment } from './types';
import NavBar from './NavBar';
import CameraModal from './CameraModal';
import { Star, Clock, Trash2, CheckCircle2, Heart, Plus, Share2, Users, XCircle, Camera, BarChart2, Crown, Trophy, X, MessageCircle, Send, MoreHorizontal, ImageOff, Pencil, ShoppingBag, Link as LinkIcon, Upload, Settings, Moon, Sun, Globe, Bell, Volume2, LogOut, ChevronRight, Database, ImageIcon } from 'lucide-react';

// Firebase Imports
import { db, isConfigured as isFirebaseConfigured } from './firebase';

// --- Translation Data ---
const TRANSLATIONS = {
  TR: {
    home: {
      noActivity: 'Henüz hareket yok',
      subtitle: 'İlk görevi tamamlayıp yıldızları kap!',
      pending: 'ONAY BEKLİYOR',
      approved: 'ONAYLANDI',
      rejected: 'REDDEDİLDİ',
      proofQuestion: 'Kanıt yeterli mi?',
      claimsTask: 'Görevi yaptığını söylüyor.',
      approve: 'Onayla',
      reject: 'Reddet',
      bought: 'ödül aldı',
      boughtFromStore: 'Mağazadan Satın Alındı',
      photoless: 'Fotoğrafsız',
      comments: 'Henüz yorum yok. İlk yorumu sen yap!',
      writeComment: 'Bir yorum yaz...',
      memberRank: 'Üye • Sıralama',
      invite: 'Davet Et',
      join: 'Katıl',
      taskDone: 'görev yaptı',
      dbError: 'Veritabanı bağlı değil!'
    },
    tasks: {
      title: 'Görevler',
      edit: 'Görevi Düzenle',
      create: 'Yeni Görev Ekle',
      update: 'Güncelle',
      add: 'Oluştur',
      form: {
        title: 'BAŞLIK',
        desc: 'AÇIKLAMA',
        stars: 'YILDIZ DEĞERİ',
        icon: 'İKON',
        cost: 'MALİYET',
        emoji: 'EMOJİ',
        titlePhTask: 'Örn: Çöpü At',
        titlePhReward: 'Örn: Masaj'
      }
    },
    store: {
      title: 'Mağaza',
      subtitle: 'Harcamaya başla',
      create: 'Yeni Ödül Ekle',
    },
    profile: {
      completed: 'Tamamlanan',
      stars: 'Yıldızlar',
      stats: 'İstatistikler & Üyeler',
      detail: 'Detay',
      switch: 'Kullanıcı Değiştir',
      demo: 'Demo',
      newMember: 'Yeni Üye'
    },
    channel: {
      createTitle: 'Yeni Kanal Oluştur',
      nameLabel: 'KANAL ADI',
      iconLabel: 'İKON SEÇ',
      createBtn: 'Oluştur ve Bağlantı Kopyala',
      joinTitle: 'Hızlı Profil Oluştur',
      joinDesc: 'Kanala katılmak için ismini yaz ve bir fotoğraf ekle.',
      yourName: 'İSMİN',
      joinBtn: 'Kanala Katıl'
    },
    stats: {
      title: 'Kanal İstatistikleri',
      week: 'Bu Hafta',
      month: 'Bu Ay',
      year: 'Bu Yıl',
      legendStars: 'YILDIZ',
      noData: 'Henüz veri yok'
    },
    settings: {
      title: 'Ayarlar',
      appearance: 'Görünüm',
      darkMode: 'Gece Modu',
      general: 'Genel',
      language: 'Dil',
      notifications: 'Bildirimler',
      sounds: 'Sesler',
      account: 'Hesap',
      logout: 'Çıkış Yap',
      version: 'Bizim Ev v2.0 (Online)'
    },
    camera: {
      title: 'Görevi kanıtla!',
      desc: 'Fotoğraf çek veya galeriden yükle.',
      btnCamera: 'Kamera',
      btnGallery: 'Galeri',
      btnSkip: 'Fotoğrafsız Devam Et'
    }
  },
  EN: {
    home: {
      noActivity: 'No activity yet',
      subtitle: 'Complete the first task to grab stars!',
      pending: 'PENDING',
      approved: 'APPROVED',
      rejected: 'REJECTED',
      proofQuestion: 'Is the proof sufficient?',
      claimsTask: 'claims to have done the task.',
      approve: 'Approve',
      reject: 'Reject',
      bought: 'bought a reward',
      boughtFromStore: 'Bought from Store',
      photoless: 'No Photo',
      comments: 'No comments yet. Be the first!',
      writeComment: 'Write a comment...',
      memberRank: 'Members • Ranking',
      invite: 'Invite',
      join: 'Join',
      taskDone: 'completed a task',
      dbError: 'Database not connected!'
    },
    tasks: {
      title: 'Tasks',
      edit: 'Edit Task',
      create: 'Add New Task',
      update: 'Update',
      add: 'Create',
      form: {
        title: 'TITLE',
        desc: 'DESCRIPTION',
        stars: 'STAR VALUE',
        icon: 'ICON',
        cost: 'COST',
        emoji: 'EMOJI',
        titlePhTask: 'Ex: Take out trash',
        titlePhReward: 'Ex: Massage'
      }
    },
    store: {
      title: 'Store',
      subtitle: 'Start spending',
      create: 'Add New Reward',
    },
    profile: {
      completed: 'Completed',
      stars: 'Stars',
      stats: 'Stats & Members',
      detail: 'Detail',
      switch: 'Switch User',
      demo: 'Demo',
      newMember: 'New Member'
    },
    channel: {
      createTitle: 'Create New Channel',
      nameLabel: 'CHANNEL NAME',
      iconLabel: 'SELECT ICON',
      createBtn: 'Create and Copy Link',
      joinTitle: 'Create Quick Profile',
      joinDesc: 'Enter your name and add a photo to join the channel.',
      yourName: 'YOUR NAME',
      joinBtn: 'Join Channel'
    },
    stats: {
      title: 'Channel Statistics',
      week: 'This Week',
      month: 'This Month',
      year: 'This Year',
      legendStars: 'STARS',
      noData: 'No data yet'
    },
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      general: 'General',
      language: 'Language',
      notifications: 'Notifications',
      sounds: 'Sounds',
      account: 'Account',
      logout: 'Log Out',
      version: 'LoveSync v2.0 (Online)'
    },
    camera: {
      title: 'Prove it!',
      desc: 'Take a photo or upload from gallery.',
      btnCamera: 'Camera',
      btnGallery: 'Gallery',
      btnSkip: 'Continue without Photo'
    }
  }
};

// --- Mock Data (Fallback) ---
const INITIAL_USERS: User[] = [
  { id: 'user1', name: 'Berk', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop', stars: 120 },
  { id: 'user2', name: 'Ece', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', stars: 340 }
];

const INITIAL_CHANNELS: Channel[] = [
  { id: 'ch1', name: 'Bizim Ev (Demo)', icon: '🏠', type: 'HOUSEHOLD', members: ['user1', 'user2'] }
];

const CHANNEL_ICONS = ['🏠', '❤️', '🍺', '🎮', '🏖️', '🏢', '🎓', '🐈', '🍕', '🚀', '💪', '🍿'];

// --- Helper for Mock Titles & Colors ---
const getTitleForTask = (taskTitle: string): string => {
  if (taskTitle.includes('Bulaşık')) return 'Bulaşıkların Efendisi';
  if (taskTitle.includes('Çöp')) return 'Çöpçüler Kralı';
  if (taskTitle.includes('Yatak')) return 'Uyku Gurmesi';
  if (taskTitle.includes('Alkol') || taskTitle.includes('Bira')) return 'Sünger Bob';
  if (taskTitle.includes('Manita') || taskTitle.includes('Kanat')) return 'Aşk Doktoru';
  if (taskTitle.includes('Süpür')) return 'Temizlik Robotu';
  if (taskTitle.includes('Masaj') || taskTitle.includes('Film')) return 'Keyif Pezevengi';
  return 'Ev Kahramanı';
};

const getTaskColor = (title: string): string => {
  if (title.includes('Bulaşık')) return '#3B82F6';
  if (title.includes('Çöp')) return '#22C55E';
  if (title.includes('Yatak')) return '#A855F7';
  if (title.includes('Kahvaltı')) return '#F97316';
  if (title.includes('Manita')) return '#EC4899';
  if (title.includes('Kanat')) return '#EF4444';
  if (title.includes('Alkol')) return '#EAB308';
  if (title.includes('Playstation')) return '#6366F1';
  return '#6B7280';
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  
  // State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [currentChannel, setCurrentChannel] = useState<Channel>(INITIAL_CHANNELS[0]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  
  // Settings State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'TR' | 'EN'>('TR');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  
  // UI State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null); 
  const [showCreateModal, setShowCreateModal] = useState<'TASK' | 'REWARD' | 'CHANNEL' | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [statsTimeRange, setStatsTimeRange] = useState<TimeRange>('WEEK');
  
  const [newChannelIcon, setNewChannelIcon] = useState(CHANNEL_ICONS[0]);
  const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const t = TRANSLATIONS[language];

  // --- INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
      // Check Firebase Connection
      if (isFirebaseConfigured && db) {
        setIsOnline(true);
        
        try {
            // 1. Listen to Profiles (Realtime)
            db.collection('profiles').onSnapshot((snapshot: any) => {
                const profiles = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as User));
                if (profiles.length > 0) setUsers(profiles);
                
                // Identify Current User from LocalStorage
                const storedUserId = localStorage.getItem('lovesync_user_id');
                if (storedUserId) {
                    const foundUser = profiles.find((p: any) => p.id === storedUserId);
                    if (foundUser) setCurrentUser(foundUser);
                }
            });

            // 2. Listen to Channels (Realtime)
            db.collection('channels').onSnapshot((snapshot: any) => {
                const dbChannels = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Channel));
                if (dbChannels.length > 0) {
                    setChannels(dbChannels);
                    // If user is set, ensure current channel is one they belong to
                    const storedUserId = localStorage.getItem('lovesync_user_id');
                    if (storedUserId) {
                        const userChannel = dbChannels.find((c: any) => c.members.includes(storedUserId));
                        if (userChannel && !userChannel.members.includes(currentUser.id)) {
                             // Only switch if logic dictates, avoiding jumps
                        } else if (userChannel) {
                            // Keep current if valid, else switch
                            setCurrentChannel(prev => dbChannels.find((c: any) => c.id === prev.id) || userChannel);
                        }
                    }
                }
            });

            // 3. Load Tasks & Rewards (Once)
            const tasksSnap = await db.collection('tasks').get();
            setTasks(tasksSnap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Task)));

            const rewardsSnap = await db.collection('rewards').get();
            setRewards(rewardsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Reward)));

            // 4. Listen to Feed (Realtime)
            const feedQuery = db.collection('feed_items').orderBy('timestamp', 'desc');
            feedQuery.onSnapshot((snapshot: any) => {
                const items = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as FeedItem));
                setFeedItems(items);
            });

        } catch (e) {
            console.error("Firebase Data load error:", e);
        }
      } else {
          // Check for Invite Link in URL even in Offline/Demo mode
          const path = window.location.pathname;
          if (path.includes('/invite/')) {
              setShowJoinModal(true);
          }
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Helpers ---

  const addNotification = (message: string, type: 'success' | 'info' | 'error') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const switchUser = () => {
    // Demo Mode Switcher - In Real DB mode, this acts as a 'Quick Login' for debugging or multi-user on same device
    const currentIndex = users.findIndex(u => u.id === currentUser.id);
    const nextIndex = (currentIndex + 1) % users.length;
    const nextUser = users[nextIndex];
    
    if (nextUser) {
        setCurrentUser(nextUser);
        localStorage.setItem('lovesync_user_id', nextUser.id);
        
        if (!currentChannel.members.includes(nextUser.id)) {
          const userChannel = channels.find(c => c.members.includes(nextUser.id));
          if (userChannel) setCurrentChannel(userChannel);
        }

        addNotification(`${nextUser.name} ${language === 'TR' ? 'olarak giriş yapıldı' : 'logged in as'}`, 'info');
    }
  };

  const inviteLink = () => {
    const link = `https://lovesync.app/invite/${currentChannel.id}`;
    navigator.clipboard.writeText(link);
    addNotification(language === 'TR' ? 'Davet bağlantısı kopyalandı!' : 'Invite link copied!', 'success');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newAvatar = reader.result as string;
        
        // Optimistic UI
        setCurrentUser(prev => ({ ...prev, avatar: newAvatar }));
        setUsers(users.map(u => u.id === currentUser.id ? { ...u, avatar: newAvatar } : u));
        
        if (isOnline && db) {
            await db.collection('profiles').doc(currentUser.id).update({ avatar: newAvatar });
        }
        addNotification(language === 'TR' ? 'Profil resmi güncellendi' : 'Profile picture updated', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Computed Data ---
  const channelTasks = useMemo(() => {
    return tasks.filter(t => t.channelType === 'ALL' || t.channelType === currentChannel.type);
  }, [tasks, currentChannel]);

  const channelRewards = useMemo(() => {
    return rewards.filter(r => r.channelType === 'ALL' || r.channelType === currentChannel.type);
  }, [rewards, currentChannel]);

  const channelFeed = useMemo(() => {
    return feedItems.filter(item => item.channelId === currentChannel.id);
  }, [feedItems, currentChannel]);

  const memberStats = useMemo(() => {
    return currentChannel.members.map(memberId => {
      const user = users.find(u => u.id === memberId);
      const userTasks = feedItems.filter(i => i.userId === memberId && i.channelId === currentChannel.id && i.status === VerificationStatus.APPROVED && i.type !== 'REWARD');
      
      const taskCounts: {[key: string]: number} = {};
      userTasks.forEach(item => {
        taskCounts[item.taskTitle] = (taskCounts[item.taskTitle] || 0) + 1;
      });
      
      let topTaskTitle = '';
      let maxCount = 0;
      Object.entries(taskCounts).forEach(([title, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topTaskTitle = title;
        }
      });

      const nickname = topTaskTitle ? getTitleForTask(topTaskTitle) : (language === 'TR' ? 'Çaylak' : 'Rookie');
      const totalStars = userTasks.reduce((acc, curr) => {
         const t = tasks.find(task => task.id === curr.taskId);
         return acc + (t?.stars || 0);
      }, 0);

      const totalTasks = userTasks.length;
      const breakdown = Object.entries(taskCounts)
        .map(([title, count]) => ({
          title,
          count,
          percent: totalTasks > 0 ? (count / totalTasks) * 100 : 0,
          color: getTaskColor(title)
        }))
        .sort((a, b) => b.count - a.count);

      return {
        user,
        nickname,
        taskCount: userTasks.length,
        totalStars,
        breakdown
      };
    }).sort((a, b) => b.totalStars - a.totalStars);
  }, [currentChannel, feedItems, users, tasks, language]);

  // --- Actions ---

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsCameraOpen(true);
  };

  const handleEditTask = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setEditingTask(task);
    setShowCreateModal('TASK');
  };

  const handleTaskSubmit = async (imageSrc: string) => {
    setIsCameraOpen(false);
    if (!selectedTask) return;

    const newItem: FeedItem = {
      id: Date.now().toString(),
      taskId: selectedTask.id,
      channelId: currentChannel.id,
      userId: currentUser.id,
      taskTitle: selectedTask.title,
      imageUrl: imageSrc,
      type: 'TASK',
      timestamp: Date.now(),
      status: VerificationStatus.PENDING,
      likes: [],
      comments: []
    };

    // Optimistic UI
    setFeedItems(prev => [newItem, ...prev]);
    
    if (isOnline && db) {
        await db.collection('feed_items').doc(newItem.id).set(newItem);
    }

    addNotification('Görev onaya gönderildi!', 'info');
    setSelectedTask(null);
    setActiveTab(Tab.HOME);
  };

  const handleBuyReward = async (reward: Reward) => {
    if (currentUser.stars >= reward.cost) {
      // Deduct stars
      const newStars = currentUser.stars - reward.cost;
      const updatedUser = { ...currentUser, stars: newStars };
      
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      
      if (isOnline && db) {
          await db.collection('profiles').doc(currentUser.id).update({ stars: newStars });
      }

      // Add to Feed
      const newItem: FeedItem = {
        id: Date.now().toString(),
        taskId: reward.id, // using reward id
        channelId: currentChannel.id,
        userId: currentUser.id,
        taskTitle: reward.title,
        emoji: reward.emoji,
        type: 'REWARD',
        timestamp: Date.now(),
        status: VerificationStatus.APPROVED, // Rewards are auto-approved
        likes: [],
        comments: []
      };

      setFeedItems(prev => [newItem, ...prev]);
      
      if (isOnline && db) {
          await db.collection('feed_items').doc(newItem.id).set(newItem);
      }

      addNotification(`${reward.title} satın alındı!`, 'success');
      setActiveTab(Tab.HOME);
    } else {
      addNotification('Yeterli yıldızın yok :(', 'error');
    }
  };

  const handleVerifyTask = async (item: FeedItem, isApproved: boolean) => {
    if (isApproved) {
      const task = tasks.find(t => t.id === item.taskId);
      const starsToAdd = task ? task.stars : 0;
      
      // Update User Stars
      const taskOwner = users.find(u => u.id === item.userId);
      if (taskOwner) {
          const newStars = taskOwner.stars + starsToAdd;
          if (isOnline && db) {
              await db.collection('profiles').doc(item.userId).update({ stars: newStars });
          }
          setUsers(users.map(u => u.id === item.userId ? { ...u, stars: newStars } : u));
          if (currentUser.id === item.userId) setCurrentUser(prev => ({ ...prev, stars: newStars }));
      }

      setFeedItems(prev => prev.map(i => i.id === item.id ? { ...i, status: VerificationStatus.APPROVED } : i));
      if (isOnline && db) {
          await db.collection('feed_items').doc(item.id).update({ status: VerificationStatus.APPROVED });
      }

      addNotification(`Onaylandı! ${starsToAdd} yıldız verildi.`, 'success');
    } else {
      setFeedItems(prev => prev.map(i => i.id === item.id ? { ...i, status: VerificationStatus.REJECTED } : i));
      if (isOnline && db) {
          await db.collection('feed_items').doc(item.id).update({ status: VerificationStatus.REJECTED });
      }
      addNotification('Görev reddedildi.', 'error');
    }
  };

  const handleCreateOrEdit = async (formData: FormData) => {
    const title = formData.get('title') as string;
    const desc = formData.get('desc') as string;
    const value = Number(formData.get('value'));
    const icon = formData.get('icon') as string;

    if (showCreateModal === 'TASK') {
        if (editingTask) {
            // Edit existing
            const updatedTask = { ...editingTask, title, description: desc, stars: value, icon: icon || editingTask.icon };
            setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
            
            if (isOnline && db) {
                await db.collection('tasks').doc(editingTask.id).update(updatedTask);
            }
            addNotification('Görev güncellendi', 'success');
        } else {
            // Create new
            const newTask: Task = {
                id: Date.now().toString(),
                title,
                description: desc,
                stars: value,
                icon: icon || '✨',
                channelType: currentChannel.type
            };
            setTasks(prev => [...prev, newTask]);
            
            if (isOnline && db) {
                await db.collection('tasks').doc(newTask.id).set(newTask);
            }
            addNotification('Yeni görev eklendi!', 'success');
        }
    } else if (showCreateModal === 'REWARD') {
        const newReward: Reward = {
            id: Date.now().toString(),
            title,
            description: desc,
            cost: value,
            emoji: icon || '🎁',
            channelType: currentChannel.type
        };
        setRewards(prev => [...prev, newReward]);
        
        if (isOnline && db) {
            await db.collection('rewards').doc(newReward.id).set(newReward);
        }
        addNotification('Yeni ödül eklendi!', 'success');
    } else if (showCreateModal === 'CHANNEL') {
        const name = formData.get('name') as string;
        const newChannel: Channel = {
            id: Date.now().toString(),
            name,
            icon: newChannelIcon,
            type: 'HOUSEHOLD',
            members: [currentUser.id]
        };
        setChannels(prev => [...prev, newChannel]);
        setCurrentChannel(newChannel);
        
        if (isOnline && db) {
            await db.collection('channels').doc(newChannel.id).set(newChannel);
        }

        navigator.clipboard.writeText(`https://lovesync.app/invite/${newChannel.id}`);
        addNotification('Kanal oluşturuldu ve bağlantı kopyalandı!', 'success');
    }
    
    setShowCreateModal(null);
    setEditingTask(null);
  };

  const handleJoinChannel = async (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get('name') as string;
      const avatarFile = (formData.get('avatar') as File);
      
      let avatarUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

      if (avatarFile && avatarFile.size > 0) {
          // In a real app, upload to storage. Here convert to base64
          const reader = new FileReader();
          reader.readAsDataURL(avatarFile);
          await new Promise(resolve => { reader.onloadend = resolve; });
          avatarUrl = reader.result as string;
      }

      // Create new user profile
      const newUser: User = {
          id: Date.now().toString(), // Should use Auth ID in real app
          name,
          avatar: avatarUrl,
          stars: 0
      };

      setCurrentUser(newUser);
      setUsers(prev => [...prev, newUser]);
      
      // Add user to current channel (Assuming invitation link brought them here)
      // For this demo, we add them to the currently selected 'demo' channel or first one
      const targetChannel = currentChannel;
      const updatedChannel = { ...targetChannel, members: [...targetChannel.members, newUser.id] };
      
      setChannels(prev => prev.map(c => c.id === targetChannel.id ? updatedChannel : c));
      setCurrentChannel(updatedChannel);

      localStorage.setItem('lovesync_user_id', newUser.id);

      if (isOnline && db) {
          await db.collection('profiles').doc(newUser.id).set(newUser);
          await db.collection('channels').doc(targetChannel.id).update({ members: updatedChannel.members });
      }

      setShowJoinModal(false);
      addNotification('Kanala katıldın!', 'success');
  };

  const handlePostComment = async (itemId: string) => {
    if (!commentText.trim()) return;
    const newComment: Comment = { id: Date.now().toString(), userId: currentUser.id, text: commentText, timestamp: Date.now() };
    
    // Optimistic
    setFeedItems(prev => prev.map(item => item.id === itemId ? { ...item, comments: [...item.comments, newComment] } : item));
    
    if (isOnline && db) {
        const item = feedItems.find(i => i.id === itemId);
        if (item) {
            await db.collection('feed_items').doc(itemId).update({ comments: [...item.comments, newComment] });
        }
    }

    setCommentText('');
  };

  const handleToggleLike = async (itemId: string) => {
    const item = feedItems.find(i => i.id === itemId);
    if (!item) return;

    const hasLiked = item.likes.includes(currentUser.id);
    const newLikes = hasLiked ? item.likes.filter(id => id !== currentUser.id) : [...item.likes, currentUser.id];

    // Optimistic
    setFeedItems(prev => prev.map(i => i.id === itemId ? { ...i, likes: newLikes } : i));

    if (isOnline && db) {
        await db.collection('feed_items').doc(itemId).update({ likes: newLikes });
    }
  };

  // --- Renderers ---

  const renderHome = () => (
    <div className="flex flex-col h-full pb-24 bg-brand-light min-h-screen dark:bg-brand-dark transition-colors duration-300">
      {/* Header with Channel List */}
      <div className="pt-8 px-4 pb-4 sticky top-0 z-40 bg-brand-light/95 dark:bg-brand-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-[80%]">
            {channels.filter(c => c.members.includes(currentUser.id)).map(channel => (
              <button
                key={channel.id}
                onClick={() => setCurrentChannel(channel)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                  currentChannel.id === channel.id 
                    ? 'bg-brand-primary text-white shadow-brand-primary/30' 
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{channel.icon}</span>
                <span>{channel.name}</span>
              </button>
            ))}
            <button 
                onClick={() => setShowCreateModal('CHANNEL')}
                className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0"
            >
                <Plus size={18} />
            </button>
            <button 
                onClick={() => setShowJoinModal(true)}
                className="px-3 py-2 rounded-2xl bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 flex items-center gap-1 shrink-0 text-xs font-bold"
            >
                <LinkIcon size={14} /> {t.home.join}
            </button>
          </div>
          {/* Settings Icon */}
          <button 
             onClick={() => setShowSettingsModal(true)}
             className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm"
          >
              <Settings size={20} />
          </button>
        </div>

        {/* Offline Warning */}
        {!isOnline && (
            <div className="mb-2 bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <Database size={14} /> {t.home.dbError}
            </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center justify-between border border-gray-100 dark:border-gray-700 shadow-soft">
          <button onClick={() => setShowMembersModal(true)} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-brand-primary transition-colors">
            <div className="flex -space-x-2">
               {currentChannel.members.slice(0,3).map(mid => {
                   const u = users.find(user => user.id === mid);
                   return <img key={mid} src={u?.avatar} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 object-cover" />
               })}
            </div>
            <span className="font-semibold text-xs ml-1">{currentChannel.members.length} {t.home.memberRank}</span>
          </button>
          <button onClick={inviteLink} className="text-xs font-bold bg-brand-secondary/10 text-brand-secondary px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-brand-secondary/20 transition-colors">
            <Share2 size={12} /> {t.home.invite}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 py-4 flex flex-col gap-6">
        {channelFeed.length === 0 ? (
           <div className="text-center py-20 flex flex-col items-center">
             <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-soft mb-6 dark:border dark:border-gray-700">
               <Camera size={40} className="text-brand-primary/50" />
             </div>
             <p className="font-bold text-xl text-brand-dark dark:text-white">{t.home.noActivity}</p>
             <p className="text-sm text-gray-400 mt-2">{t.home.subtitle}</p>
           </div>
        ) : (
          channelFeed.map(item => {
            const owner = users.find(u => u.id === item.userId);
            const isMyTask = item.userId === currentUser.id;
            const isReward = item.type === 'REWARD';
            const nickname = memberStats.find(s => s.user?.id === item.userId)?.nickname || (language === 'TR' ? 'Üye' : 'Member');
            const hasLiked = item.likes.includes(currentUser.id);
            const areCommentsOpen = openCommentsId === item.id;

            return (
              <div key={item.id} className={`rounded-3xl overflow-hidden border shadow-soft animate-in slide-in-from-bottom-4 duration-500 ${isReward ? 'bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 border-purple-100 dark:border-purple-800' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
                {/* Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={owner?.avatar} className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-700 object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                          <p className="font-bold text-sm text-brand-dark dark:text-white">{owner?.name}</p>
                          <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20 px-1.5 py-0.5 rounded-full">{nickname}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        {isReward ? t.home.bought : t.home.taskDone}
                        <span className="text-gray-300 dark:text-gray-500">• {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>
                  </div>
                  {isReward ? <ShoppingBag size={18} className="text-purple-400" /> : <MoreHorizontal size={20} className="text-gray-300" />}
                </div>

                {/* Content */}
                {isReward ? (
                    <div className="px-6 py-6 flex flex-col items-center text-center">
                        <div className="text-6xl mb-4 animate-bounce delay-1000 duration-1000">{item.emoji}</div>
                        <h3 className="font-bold text-xl text-brand-dark dark:text-white mb-1">{item.taskTitle}</h3>
                        <p className="text-sm text-purple-500 font-medium bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-full">{t.home.boughtFromStore}</p>
                    </div>
                ) : (
                    <div className="relative aspect-[4/5] bg-gray-50 dark:bg-gray-900">
                        {item.imageUrl ? (
                            <img src={item.imageUrl} className={`w-full h-full object-cover ${item.status === VerificationStatus.REJECTED ? 'grayscale opacity-50' : ''}`} />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-light to-white dark:from-gray-800 dark:to-gray-900">
                                <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-5xl mb-4 border border-gray-50 dark:border-gray-700">
                                    {tasks.find(t => t.id === item.taskId)?.icon || '⚡️'}
                                </div>
                                <p className="text-brand-dark dark:text-white font-bold text-lg px-8 text-center">{item.taskTitle}</p>
                                <span className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-wider">{t.home.photoless}</span>
                            </div>
                        )}
                        
                        {/* Status */}
                        <div className="absolute top-4 right-4">
                            <div className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg border border-white/20 ${
                                item.status === VerificationStatus.APPROVED ? 'bg-green-500 text-white' :
                                item.status === VerificationStatus.REJECTED ? 'bg-red-500 text-white' :
                                'bg-yellow-400 text-black'
                            }`}>
                                {item.status === VerificationStatus.APPROVED ? t.home.approved : 
                                item.status === VerificationStatus.REJECTED ? t.home.rejected : t.home.pending}
                            </div>
                        </div>

                        {/* Verification Actions */}
                        {item.status === VerificationStatus.PENDING && !isMyTask && (
                            <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 dark:border-gray-700">
                                <p className="text-center text-sm mb-3 font-semibold text-gray-700 dark:text-gray-200">{t.home.proofQuestion}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleVerifyTask(item, false)} className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-900/50 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"><XCircle size={18} /> {t.home.reject}</button>
                                    <button onClick={() => handleVerifyTask(item, true)} className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 dark:shadow-none"><CheckCircle2 size={18} /> {t.home.approve}</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions Bar */}
                <div className="p-3 flex items-center gap-4 border-t border-gray-50 dark:border-gray-700">
                    <button onClick={() => handleToggleLike(item.id)} className={`flex items-center gap-1.5 transition-all active:scale-90 ${hasLiked ? 'text-red-500' : 'text-gray-400'}`}>
                        <Heart size={24} fill={hasLiked ? "currentColor" : "none"} />
                        <span className="font-bold text-sm">{item.likes.length > 0 ? item.likes.length : ''}</span>
                    </button>
                    <button onClick={() => setOpenCommentsId(areCommentsOpen ? null : item.id)} className="flex items-center gap-1.5 text-gray-400 hover:text-brand-primary transition-colors">
                        <MessageCircle size={24} />
                        <span className="font-bold text-sm">{item.comments.length > 0 ? item.comments.length : ''}</span>
                    </button>
                </div>

                {/* Comments */}
                {areCommentsOpen && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-2">
                        <div className="max-h-40 overflow-y-auto space-y-3 mb-3 no-scrollbar">
                            {item.comments.length === 0 && <p className="text-xs text-gray-400 text-center py-2">{t.home.comments}</p>}
                            {item.comments.map(comment => (
                                <div key={comment.id} className="flex gap-2 items-start text-sm">
                                    <span className="font-bold text-gray-900 dark:text-gray-100 shrink-0">{users.find(u => u.id === comment.userId)?.name}</span>
                                    <span className="text-gray-600 dark:text-gray-400 break-all">{comment.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder={t.home.writeComment} className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-primary text-black dark:text-white" onKeyDown={(e) => e.key === 'Enter' && handlePostComment(item.id)} />
                            <button onClick={() => handlePostComment(item.id)} disabled={!commentText.trim()} className="p-2 bg-brand-primary text-white rounded-full disabled:opacity-50"><Send size={16} /></button>
                        </div>
                    </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="pb-24 px-4 pt-8 bg-brand-light dark:bg-brand-dark min-h-screen transition-colors duration-300">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-brand-dark dark:text-white mb-1">{t.tasks.title}</h2>
          <p className="text-gray-400 text-sm font-medium">{currentChannel.name}</p>
        </div>
        <button 
          onClick={() => { setEditingTask(null); setShowCreateModal('TASK'); }}
          className="bg-brand-primary text-white p-3 rounded-2xl shadow-lg shadow-brand-primary/30 hover:scale-105 transition-transform active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {channelTasks.map(task => (
          <div 
            key={task.id} 
            onClick={() => handleTaskClick(task)}
            className="group bg-white dark:bg-gray-800 p-5 rounded-3xl flex items-center justify-between border border-gray-100 dark:border-gray-700 shadow-soft active:scale-98 transition-all cursor-pointer relative overflow-hidden"
          >
            {/* Edit Button */}
            <button 
                onClick={(e) => handleEditTask(e, task)}
                className="absolute top-3 right-3 p-2 text-gray-300 hover:text-brand-primary hover:bg-brand-light dark:hover:bg-gray-700 rounded-full transition-colors z-10"
            >
                <Pencil size={16} />
            </button>

            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-brand-light dark:bg-gray-700 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {task.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-brand-dark dark:text-white leading-tight mb-1">{task.title}</h3>
                <p className="text-xs text-gray-400 font-medium max-w-[200px] truncate">{task.description}</p>
              </div>
            </div>
            <div className="bg-brand-secondary/10 px-4 py-2 rounded-full flex items-center gap-1.5 self-end mb-1">
              <span className="font-extrabold text-brand-secondary text-lg">{task.stars}</span>
              <Star size={14} className="text-brand-secondary fill-brand-secondary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStore = () => (
    <div className="pb-24 px-4 pt-8 bg-brand-light dark:bg-brand-dark min-h-screen transition-colors duration-300">
      <div className="flex justify-between items-end mb-8">
        <div>
           <h2 className="text-3xl font-extrabold text-brand-dark dark:text-white mb-1">{t.store.title}</h2>
           <p className="text-gray-400 text-sm font-medium">{t.store.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
            <button 
              onClick={() => { setEditingTask(null); setShowCreateModal('REWARD'); }}
              className="bg-white dark:bg-gray-800 text-gray-500 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <Plus size={20} />
            </button>
            <div className="flex items-center gap-2 bg-brand-dark dark:bg-black text-white px-5 py-2.5 rounded-2xl shadow-lg">
               <span className="font-black text-xl">{currentUser.stars}</span>
               <Star size={18} className="text-brand-secondary fill-brand-secondary" />
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {channelRewards.map(reward => {
          const canAfford = currentUser.stars >= reward.cost;
          return (
            <div key={reward.id} className={`bg-white dark:bg-gray-800 p-5 rounded-3xl border ${canAfford ? 'border-gray-100 dark:border-gray-700' : 'border-gray-100 dark:border-gray-700 opacity-60'} shadow-soft flex flex-col justify-between aspect-square relative overflow-hidden group`}>
              <div className="relative z-10 text-center flex-1 flex flex-col items-center justify-center">
                <div className="text-5xl mb-4 drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">{reward.emoji}</div>
                <h3 className="font-bold text-md leading-tight mb-2 text-brand-dark dark:text-white">{reward.title}</h3>
                <p className="text-[10px] text-gray-400 leading-tight font-medium">{reward.description}</p>
              </div>
              <button onClick={() => handleBuyReward(reward)} disabled={!canAfford} className={`mt-2 relative z-10 w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${canAfford ? 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
                {reward.cost} <Star size={10} fill={canAfford ? "white" : "gray"} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="pb-24 px-4 pt-12 text-center bg-brand-light dark:bg-brand-dark min-h-screen transition-colors duration-300">
      <div className="relative inline-block mb-6 group">
        <div className="relative w-32 h-32">
            <img src={currentUser.avatar} className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 shadow-xl object-cover p-1 bg-white dark:bg-gray-800" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={32} />
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAvatarChange} />
            </div>
        </div>
        <div className="absolute bottom-1 right-1 bg-brand-secondary text-white p-2 rounded-full border-4 border-white dark:border-gray-800 shadow-md"><Heart size={18} fill="white" /></div>
        <button 
             onClick={() => setShowSettingsModal(true)}
             className="absolute -top-2 -right-12 w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm md:hidden"
          >
              <Settings size={20} />
          </button>
      </div>
      <h2 className="text-3xl font-extrabold text-brand-dark dark:text-white mb-1">{currentUser.name}</h2>
      <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-white dark:bg-gray-800 rounded-full mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <Crown size={14} className="text-brand-secondary" />
        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{memberStats.find(m => m.user?.id === currentUser.id)?.nickname || t.profile.newMember}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft">
          <h3 className="text-3xl font-black text-brand-dark dark:text-white mb-1">{feedItems.filter(t => t.userId === currentUser.id && t.status === VerificationStatus.APPROVED && t.type === 'TASK').length}</h3>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t.profile.completed}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft">
          <h3 className="text-3xl font-black text-brand-secondary mb-1">{currentUser.stars}</h3>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t.profile.stars}</p>
        </div>
      </div>
      <div className="space-y-3">
        <button onClick={() => setShowMembersModal(true)} className="w-full bg-white dark:bg-gray-800 text-brand-dark dark:text-white py-4 rounded-2xl font-bold border border-gray-100 dark:border-gray-700 shadow-soft flex items-center justify-between px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="flex items-center gap-3"><BarChart2 size={20} className="text-brand-primary" /> {t.profile.stats}</span>
            <span className="text-xs bg-brand-light dark:bg-gray-700 px-2 py-1 rounded text-gray-500 dark:text-gray-400 font-semibold">{t.profile.detail}</span>
        </button>
        <button onClick={switchUser} className="w-full bg-white dark:bg-gray-800 text-brand-dark dark:text-white py-4 rounded-2xl font-bold border border-gray-100 dark:border-gray-700 shadow-soft flex items-center justify-between px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="flex items-center gap-3"><Users size={20} className="text-gray-400" /> {t.profile.switch}</span>
            <span className="text-xs bg-brand-light dark:bg-gray-700 px-2 py-1 rounded text-gray-500 dark:text-gray-400 font-semibold">{t.profile.demo}</span>
        </button>
      </div>
    </div>
  );

  const renderCreateModalContent = () => {
    if (showCreateModal === 'CHANNEL') {
        return (
            <div className="p-6 bg-white dark:bg-gray-900">
                <h2 className="text-2xl font-bold mb-6 text-brand-dark dark:text-white">{t.channel.createTitle}</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleCreateOrEdit(new FormData(e.currentTarget)); }} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">{t.channel.nameLabel}</label>
                        <input name="name" required className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-brand-dark dark:text-white border border-gray-200 dark:border-gray-700 outline-none focus:border-brand-primary" placeholder="Örn: Yazlık Ev" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">{t.channel.iconLabel}</label>
                        <div className="grid grid-cols-6 gap-2">
                             {CHANNEL_ICONS.map(icon => (
                                 <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setNewChannelIcon(icon)}
                                    className={`aspect-square flex items-center justify-center text-xl rounded-xl transition-all ${newChannelIcon === icon ? 'bg-brand-primary text-white scale-110 shadow-lg' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                 >
                                     {icon}
                                 </button>
                             ))}
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl mt-4">{t.channel.createBtn}</button>
                </form>
            </div>
        )
    }

    const isTask = showCreateModal === 'TASK';
    return (
      <div className="p-6 bg-white dark:bg-gray-900">
         <h2 className="text-2xl font-bold mb-6 text-brand-dark dark:text-white">
             {editingTask ? t.tasks.edit : (isTask ? t.tasks.create : t.store.create)}
         </h2>
         <form onSubmit={(e) => { e.preventDefault(); handleCreateOrEdit(new FormData(e.currentTarget)); }} className="space-y-4">
           <div>
             <label className="block text-xs font-bold text-gray-400 mb-1">{t.tasks.form.title}</label>
             <input name="title" defaultValue={editingTask?.title} required className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-brand-dark dark:text-white border border-gray-200 dark:border-gray-700 focus:border-brand-primary outline-none" placeholder={isTask ? t.tasks.form.titlePhTask : t.tasks.form.titlePhReward} />
           </div>
           <div>
             <label className="block text-xs font-bold text-gray-400 mb-1">{t.tasks.form.desc}</label>
             <input name="desc" defaultValue={editingTask?.description} required className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-brand-dark dark:text-white border border-gray-200 dark:border-gray-700 focus:border-brand-primary outline-none" placeholder="..." />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-bold text-gray-400 mb-1">{isTask ? t.tasks.form.stars : t.tasks.form.cost}</label>
               <input name="value" defaultValue={editingTask?.stars} type="number" required className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-brand-dark dark:text-white border border-gray-200 dark:border-gray-700 focus:border-brand-primary outline-none" placeholder="100" />
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-400 mb-1">{isTask ? t.tasks.form.icon : t.tasks.form.emoji}</label>
               <input name="icon" defaultValue={editingTask?.icon} className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-brand-dark dark:text-white border border-gray-200 dark:border-gray-700 focus:border-brand-primary outline-none" placeholder="🧹" />
             </div>
           </div>
           <button type="submit" className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl mt-4 hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 transition-all">
             {editingTask ? t.tasks.update : t.tasks.add}
           </button>
         </form>
      </div>
    );
  };

  const renderJoinModal = () => (
      <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95">
              <div className="text-center mb-6">
                 <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                     <span className="text-4xl">{currentChannel.icon}</span>
                 </div>
                 <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-2">{t.channel.joinTitle}</h2>
                 <p className="text-gray-500 text-sm">{t.channel.joinDesc}</p>
              </div>
              <form onSubmit={handleJoinChannel} className="space-y-4">
                  <div className="flex flex-col items-center mb-4">
                      <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative cursor-pointer hover:border-brand-primary transition-colors overflow-hidden">
                          <input name="avatar" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => {
                              // Simple preview logic
                              const file = e.target.files?.[0];
                              if(file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                      const img = document.getElementById('avatar-preview') as HTMLImageElement;
                                      if(img && ev.target?.result) img.src = ev.target.result as string;
                                  }
                                  reader.readAsDataURL(file);
                              }
                          }} />
                          <img id="avatar-preview" className="absolute inset-0 w-full h-full object-cover" style={{display: 'none'}} />
                          <Camera className="text-gray-400" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">{t.channel.yourName}</label>
                      <input name="name" required className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center text-lg font-bold text-brand-dark dark:text-white border border-gray-200 dark:border-gray-700 focus:border-brand-primary outline-none" placeholder="Adın..." />
                  </div>
                  <button type="submit" className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-primary/30">
                      {t.channel.joinBtn}
                  </button>
              </form>
          </div>
      </div>
  );

  const renderSettingsModal = () => (
      <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white dark:bg-gray-900 h-full shadow-2xl p-6 animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-brand-dark dark:text-white">{t.settings.title}</h2>
                  <button onClick={() => setShowSettingsModal(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><X size={20} /></button>
              </div>

              <div className="space-y-6">
                  <div>
                      <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">{t.settings.appearance}</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
                          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
                              <div className="flex items-center gap-3">
                                  {isDarkMode ? <Moon size={20} className="text-purple-400" /> : <Sun size={20} className="text-orange-400" />}
                                  <span className="font-medium text-brand-dark dark:text-white">{t.settings.darkMode}</span>
                              </div>
                              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-brand-primary' : 'bg-gray-300'}`}>
                                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isDarkMode ? 'translate-x-6' : ''}`} />
                              </div>
                          </button>
                      </div>
                  </div>

                  <div>
                      <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">{t.settings.general}</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
                          <button onClick={() => setLanguage(prev => prev === 'TR' ? 'EN' : 'TR')} className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
                              <div className="flex items-center gap-3">
                                  <Globe size={20} className="text-blue-400" />
                                  <span className="font-medium text-brand-dark dark:text-white">{t.settings.language}</span>
                              </div>
                              <span className="text-sm font-bold text-gray-400">{language}</span>
                          </button>
                          <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
                              <div className="flex items-center gap-3">
                                  <Bell size={20} className="text-red-400" />
                                  <span className="font-medium text-brand-dark dark:text-white">{t.settings.notifications}</span>
                              </div>
                              <span className={`text-sm font-bold ${notificationsEnabled ? 'text-green-500' : 'text-gray-400'}`}>{notificationsEnabled ? 'On' : 'Off'}</span>
                          </button>
                           <button onClick={() => setSoundEnabled(!soundEnabled)} className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700">
                              <div className="flex items-center gap-3">
                                  <Volume2 size={20} className="text-green-400" />
                                  <span className="font-medium text-brand-dark dark:text-white">{t.settings.sounds}</span>
                              </div>
                               <span className={`text-sm font-bold ${soundEnabled ? 'text-green-500' : 'text-gray-400'}`}>{soundEnabled ? 'On' : 'Off'}</span>
                          </button>
                      </div>
                  </div>

                  <div>
                      <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">{t.settings.account}</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
                          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500">
                              <div className="flex items-center gap-3">
                                  <LogOut size={20} />
                                  <span className="font-medium">{t.settings.logout}</span>
                              </div>
                          </button>
                      </div>
                  </div>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 text-center">
                  <p className="text-xs text-gray-400">{t.settings.version}</p>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-brand-light font-sans selection:bg-brand-primary selection:text-white text-gray-900">
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4 z-[70] flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-xl border transition-all duration-300 animate-in slide-in-from-top-4 fade-in ${n.type === 'success' ? 'bg-white border-green-200 text-green-700' : n.type === 'error' ? 'bg-white border-red-200 text-red-700' : 'bg-white border-blue-200 text-blue-700'}`}>
            {n.type === 'success' ? <CheckCircle2 size={20} className="text-green-500" /> : n.type === 'error' ? <Trash2 size={20} className="text-red-500" /> : <Clock size={20} className="text-blue-500" />}
            <span className="text-sm font-bold">{n.message}</span>
          </div>
        ))}
      </div>

      <main className="max-w-md mx-auto min-h-screen relative bg-brand-light dark:bg-brand-dark shadow-2xl overflow-hidden border-x border-gray-100 dark:border-gray-800 transition-colors duration-300">
        {activeTab === Tab.HOME && renderHome()}
        {activeTab === Tab.TASKS && renderTasks()}
        {activeTab === Tab.STORE && renderStore()}
        {activeTab === Tab.PROFILE && renderProfile()}
      </main>

      <NavBar currentTab={activeTab} setTab={setActiveTab} />
      
      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onCapture={handleTaskSubmit}
        taskTitle={selectedTask?.title || ''}
        labels={t.camera}
      />

      {showCreateModal && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl border-t border-gray-200 dark:border-gray-700 overflow-hidden relative animate-in slide-in-from-bottom-10 fade-in duration-200">
                <button 
                  onClick={() => { setShowCreateModal(null); setEditingTask(null); }}
                  className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
                {renderCreateModalContent()}
            </div>
        </div>
      )}

      {showMembersModal && (
          <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex flex-col justify-end sm:justify-center">
            <div className="bg-white dark:bg-gray-900 h-[85vh] sm:h-[80vh] w-full max-w-md mx-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-20 duration-300">
                <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-brand-dark dark:text-white">{t.stats.title}</h2>
                    <button onClick={() => setShowMembersModal(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20} className="text-gray-600 dark:text-gray-300" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl mb-6">
                        {(['WEEK', 'MONTH', 'YEAR'] as TimeRange[]).map(range => (
                            <button key={range} onClick={() => setStatsTimeRange(range)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all shadow-sm ${statsTimeRange === range ? 'bg-white dark:bg-brand-primary text-brand-primary dark:text-white' : 'text-gray-500 shadow-none'}`}>{range === 'WEEK' ? t.stats.week : range === 'MONTH' ? t.stats.month : t.stats.year}</button>
                        ))}
                    </div>
                    {memberStats.length === 0 ? <p className="text-center text-gray-400">{t.stats.noData}</p> : (
                        <div className="space-y-4">
                            {memberStats.map((stat, idx) => (
                                <div key={stat.user?.id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src={stat.user?.avatar} className="w-12 h-12 rounded-full border border-gray-100 dark:border-gray-700 object-cover" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              {idx === 0 && <Trophy size={16} className="text-yellow-500" />}
                                              <h4 className="font-bold text-lg text-brand-dark dark:text-white">{stat.user?.name}</h4>
                                            </div>
                                            <p className="text-xs text-brand-primary font-bold uppercase tracking-wide flex items-center gap-1 bg-brand-primary/5 dark:bg-brand-primary/20 inline-block px-2 py-0.5 rounded-full mt-1"><Crown size={12} /> {stat.nickname}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-brand-dark dark:text-white text-xl">{stat.totalStars}</div>
                                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{t.stats.legendStars}</div>
                                        </div>
                                    </div>
                                    <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex mb-3 border border-gray-200 dark:border-gray-600">
                                        {stat.breakdown.length > 0 ? stat.breakdown.map((item, i) => <div key={i} style={{ width: `${item.percent}%`, backgroundColor: item.color }} className="h-full" />) : <div className="w-full h-full bg-gray-100 dark:bg-gray-700"></div>}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                       {stat.breakdown.slice(0, 3).map((item, i) => <div key={i} className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 px-2 py-1 rounded-lg"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{item.title}</span><span className="text-[10px] text-gray-400 font-medium">({item.count})</span></div>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {showJoinModal && renderJoinModal()}
      {showSettingsModal && renderSettingsModal()}
    </div>
  );
};

export default App;