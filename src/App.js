import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(res => {
      setRepositories(res.data);
    })
  }, [])

  async function handleLikeRepository(id) {
    api.post(`repositories/${id}/like`)
    
    const newRepositories = repositories.map(repo => (
      repo.id === id 
      ? { ...repo, likes: repo.likes + 1 }
      : { ...repo }
    ))
    // console.log(newRepositories);
    // console.log(res.data);
    setRepositories([ ...newRepositories ]);
  }

  const _renderItem = ({ item: repository }) => {
    // console.log(repositories);
    return (
      <View style={styles.repositoryContainer}>
        <Text style={styles.repository}>{repository.title}</Text>

        <View style={styles.techsContainer}>
          <FlatList 
            data={repository.techs}
            keyExtractor={repositories => repositories}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: tech }) => (
              <Text style={styles.tech}> 
                {tech}
              </Text>
            )}
          />
        </View>

        <View style={styles.likesContainer}>
          <Text
            style={styles.likeText}
            // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
            testID={`repository-likes-${repository.id}`}
          >
            {repository.likes} curtidas
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
          onPress={() => handleLikeRepository(repository.id)}
          testID={`like-button-${repository.id}`}
        >
          <Text style={styles.buttonText}>Curtir</Text>
        </TouchableOpacity>

      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />

      <SafeAreaView style={styles.container}>
        <FlatList
          style={{ flex: 1 }}
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={_renderItem}
        />


      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
