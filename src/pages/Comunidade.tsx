
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Users, Home, AlertTriangle, Info } from 'lucide-react';
import Header from '@/components/Header';

const Comunidade = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [newPost, setNewPost] = useState('');

  const categories = [
    { id: 'todos', name: 'Todos', icon: Users, color: 'bg-gray-100 text-gray-800' },
    { id: 'ajuda', name: 'Preciso de Ajuda', icon: AlertTriangle, color: 'bg-red-100 text-red-800' },
    { id: 'abrigo', name: 'Ofereço Abrigo', icon: Home, color: 'bg-green-100 text-green-800' },
    { id: 'info', name: 'Orientações', icon: Info, color: 'bg-blue-100 text-blue-800' },
  ];

  const mockPosts = [
    {
      id: 1,
      category: 'ajuda',
      author: 'Maria Silva',
      time: '2 horas atrás',
      content: 'Estou ilhada na Rua das Flores, 123. Água subindo. Alguém pode me ajudar?',
      likes: 12,
      comments: 8,
      urgent: true
    },
    {
      id: 2,
      category: 'abrigo',
      author: 'João Santos',
      time: '3 horas atrás',
      content: 'Tenho espaço para abrigar até 4 pessoas na minha casa no Bairro Alto. Casa seca e segura.',
      likes: 25,
      comments: 15,
      urgent: false
    },
    {
      id: 3,
      category: 'info',
      author: 'Defesa Civil SP',
      time: '4 horas atrás',
      content: 'ORIENTAÇÃO: Evitem transitar pela Marginal Tietê. Vias alternativas: Av. Paulista e Rua da Consolação.',
      likes: 45,
      comments: 3,
      urgent: false,
      official: true
    },
    {
      id: 4,
      category: 'ajuda',
      author: 'Pedro Costa',
      time: '5 horas atrás',
      content: 'Preciso de informações sobre pontos de distribuição de água potável na Zona Sul.',
      likes: 8,
      comments: 12,
      urgent: false
    },
  ];

  const filteredPosts = activeTab === 'todos' 
    ? mockPosts 
    : mockPosts.filter(post => post.category === activeTab);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Comunidade</h1>
          <p className="text-gray-600">
            Conecte-se com sua comunidade, ofereça ajuda e receba apoio em momentos de necessidade.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeTab === category.id ? 'default' : 'outline'}
                  onClick={() => setActiveTab(category.id)}
                  className="whitespace-nowrap"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* New Post Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Compartilhar com a Comunidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="O que você gostaria de compartilhar? (oferecer ajuda, pedir orientação, etc.)"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
              />
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {categories.slice(1).map((category) => (
                    <Badge key={category.id} variant="outline" className="cursor-pointer hover:bg-gray-100">
                      {category.name}
                    </Badge>
                  ))}
                </div>
                <Button disabled={!newPost.trim()}>
                  Publicar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const categoryInfo = getCategoryInfo(post.category);
            return (
              <Card key={post.id} className={`${post.urgent ? 'border-red-200 bg-red-50' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">{post.author}</span>
                        {post.official && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            Oficial
                          </Badge>
                        )}
                        {post.urgent && (
                          <Badge className="bg-red-600 text-white text-xs">
                            Urgente
                          </Badge>
                        )}
                        {categoryInfo && (
                          <Badge className={categoryInfo.color}>
                            {categoryInfo.name}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">{post.time}</span>
                      </div>
                      
                      <p className="text-gray-800 mb-4">{post.content}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Emergency Info */}
        <Card className="mt-8 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">Emergências</h3>
                <p className="text-sm text-orange-800">
                  Em situações de risco imediato, ligue: <strong>193 (Bombeiros)</strong> ou <strong>199 (Defesa Civil)</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Comunidade;
